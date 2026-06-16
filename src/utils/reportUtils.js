/** Utilitas agregasi laporan dari data transaksi */

export const TX_STATUSES = ["Menunggu", "Diproses", "Selesai"];

export function parseDate(str) {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateISO(d) {
  return d.toISOString().slice(0, 10);
}

export function normalizeTransaction(tx) {
  const layananType = tx.layananType ?? "Kiloan";
  return {
    layananType,
    service: tx.service ?? "",
    weight: tx.weight ?? 0,
    lineItems: tx.lineItems ?? [],
    subtotal: tx.subtotal ?? tx.total ?? 0,
    diskon: tx.diskon ?? 0,
    metodePembayaran: tx.metodePembayaran ?? "Tunai",
    kasir: tx.kasir ?? "—",
    kasirId: tx.kasirId ?? null,
    finishDate: tx.finishDate ?? null,
    statusHistory: tx.statusHistory ?? [
      { status: tx.status ?? "Menunggu", by: tx.kasir ?? "Sistem", at: tx.tanggal ?? formatDateISO(new Date()), note: "Transaksi dibuat" },
    ],
    ...tx,
  };
}

export function getActiveTransactions(transactions) {
  return transactions.filter((t) => !t.cancelled).map(normalizeTransaction);
}

export function getLayananLabel(tx) {
  const t = normalizeTransaction(tx);
  if (t.layananType === "Satuan") {
    const items = t.lineItems?.map((i) => `${i.nama} (${i.qty})`).join(", ");
    return items || "Laundry Satuan";
  }
  return `${t.service} (${t.weight} Kg)`;
}

export function getQtyLabel(tx) {
  const t = normalizeTransaction(tx);
  if (t.layananType === "Satuan") {
    return t.lineItems?.reduce((s, i) => s + (i.qty || 0), 0) ?? 0;
  }
  return t.weight ?? 0;
}

export function filterTransactions(transactions, filters = {}) {
  let list = getActiveTransactions(transactions);

  if (filters.outlet) list = list.filter((t) => t.outlet === filters.outlet);
  if (filters.kasir) list = list.filter((t) => t.kasir === filters.kasir);
  if (filters.customer) {
    const q = filters.customer.toLowerCase();
    list = list.filter((t) => t.customer.toLowerCase().includes(q));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.customer.toLowerCase().includes(q) ||
        t.invoice.toLowerCase().includes(q) ||
        (t.kasir ?? "").toLowerCase().includes(q)
    );
  }
  if (filters.dateFrom) {
    list = list.filter((t) => t.tanggal >= filters.dateFrom);
  }
  if (filters.dateTo) {
    list = list.filter((t) => t.tanggal <= filters.dateTo);
  }
  if (filters.outlets?.length) {
    const allowed = new Set(filters.outlets);
    list = list.filter((t) => allowed.has(t.outlet));
  }

  return list;
}

export function sumRevenue(transactions) {
  return transactions.reduce((s, t) => s + (t.total ?? 0), 0);
}

export function countUniqueCustomers(transactions) {
  return new Set(transactions.map((t) => t.customer)).size;
}

export function groupByDate(transactions) {
  const map = {};
  transactions.forEach((t) => {
    map[t.tanggal] = map[t.tanggal] ?? { tanggal: t.tanggal, pendapatan: 0, transaksi: 0, pelanggan: new Set() };
    map[t.tanggal].pendapatan += t.total ?? 0;
    map[t.tanggal].transaksi += 1;
    map[t.tanggal].pelanggan.add(t.customer);
  });
  return Object.values(map)
    .map((d) => ({ ...d, pelanggan: d.pelanggan.size }))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

export function groupByOutlet(transactions) {
  const map = {};
  transactions.forEach((t) => {
    map[t.outlet] = map[t.outlet] ?? { outlet: t.outlet, pendapatan: 0, transaksi: 0 };
    map[t.outlet].pendapatan += t.total ?? 0;
    map[t.outlet].transaksi += 1;
  });
  return Object.values(map).sort((a, b) => b.pendapatan - a.pendapatan);
}

export function groupByService(transactions) {
  const map = {};
  transactions.forEach((t) => {
    const key = t.layananType === "Satuan" ? "Laundry Satuan" : t.service;
    map[key] = map[key] ?? { layanan: key, jumlah: 0 };
    map[key].jumlah += 1;
  });
  return Object.values(map).sort((a, b) => b.jumlah - a.jumlah);
}

export function getDateRange(period, refDate = new Date()) {
  const end = new Date(refDate);
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);

  if (period === "harian") {
    return { dateFrom: formatDateISO(start), dateTo: formatDateISO(end) };
  }
  if (period === "mingguan") {
    const day = start.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - diff);
    return { dateFrom: formatDateISO(start), dateTo: formatDateISO(end) };
  }
  if (period === "bulanan") {
    start.setDate(1);
    return { dateFrom: formatDateISO(start), dateTo: formatDateISO(end) };
  }
  if (period === "tahunan") {
    start.setMonth(0, 1);
    return { dateFrom: formatDateISO(start), dateTo: formatDateISO(end) };
  }
  return { dateFrom: null, dateTo: null };
}

export function getPreviousPeriodRange(period, refDate = new Date()) {
  const current = getDateRange(period, refDate);
  const start = parseDate(current.dateFrom);
  const end = parseDate(current.dateTo);
  if (!start || !end) return { dateFrom: null, dateTo: null };

  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const days = Math.round((end - start) / 86400000) + 1;
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - days + 1);

  return { dateFrom: formatDateISO(prevStart), dateTo: formatDateISO(prevEnd) };
}

export function calcGrowthPercent(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function getDailyBreakdown(transactions, dateFrom, dateTo) {
  const filtered = filterTransactions(transactions, { dateFrom, dateTo });
  return groupByDate(filtered);
}

export function getWeeklyDayLabels(dateFrom) {
  const labels = [];
  const start = parseDate(dateFrom);
  if (!start) return labels;
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    labels.push(d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }));
  }
  return labels;
}

export function getWeeklyRevenue(transactions, dateFrom, dateTo) {
  const daily = getDailyBreakdown(transactions, dateFrom, dateTo);
  const map = Object.fromEntries(daily.map((d) => [d.tanggal, d.pendapatan]));
  const start = parseDate(dateFrom);
  const values = [];
  if (!start) return values;
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    values.push(map[formatDateISO(d)] ?? 0);
  }
  return values;
}

export function getMonthlyWeeks(transactions, dateFrom, dateTo) {
  const filtered = filterTransactions(transactions, { dateFrom, dateTo });
  const weeks = [{ label: "Minggu 1", pendapatan: 0 }, { label: "Minggu 2", pendapatan: 0 }, { label: "Minggu 3", pendapatan: 0 }, { label: "Minggu 4", pendapatan: 0 }];
  filtered.forEach((t) => {
    const day = parseDate(t.tanggal)?.getDate() ?? 1;
    const idx = Math.min(Math.floor((day - 1) / 7), 3);
    weeks[idx].pendapatan += t.total ?? 0;
  });
  return weeks;
}

export function buildFinancialSummary(transactions, expenses, filters) {
  const txFiltered = filterTransactions(transactions, filters);
  const expFiltered = (expenses ?? []).filter((e) => {
    if (filters.outlet && e.outlet !== filters.outlet) return false;
    if (filters.outlets?.length && !filters.outlets.includes(e.outlet)) return false;
    if (filters.dateFrom && e.tanggal < filters.dateFrom) return false;
    if (filters.dateTo && e.tanggal > filters.dateTo) return false;
    return true;
  });

  const pendapatan = sumRevenue(txFiltered);
  const pengeluaran = expFiltered.reduce((s, e) => s + e.nominal, 0);

  return {
    pendapatan,
    pengeluaran,
    labaBersih: pendapatan - pengeluaran,
    totalTransaksi: txFiltered.length,
    totalPelanggan: countUniqueCustomers(txFiltered),
    transactions: txFiltered,
    perOutlet: groupByOutlet(txFiltered),
  };
}
