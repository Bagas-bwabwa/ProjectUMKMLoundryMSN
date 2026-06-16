/** Data mock terpusat — Sistem Manajemen Laundry Multi Cabang (12 outlet) */

export const outlets = [
  { id: 1, nama: "Laundry Panam", kota: "Pekanbaru", alamat: "Jl. HR Soebrantas No.88", telepon: "08123456701", status: "Aktif" },
  { id: 2, nama: "Laundry Arengka", kota: "Pekanbaru", alamat: "Jl. Arengka No.12", telepon: "08123456702", status: "Aktif" },
  { id: 3, nama: "Laundry Marpoyan", kota: "Pekanbaru", alamat: "Jl. Marpoyan Damai", telepon: "08123456703", status: "Aktif" },
  { id: 4, nama: "Laundry Sail", kota: "Pekanbaru", alamat: "Jl. Sudirman No.45", telepon: "08123456704", status: "Aktif" },
  { id: 5, nama: "Laundry Kulim", kota: "Pekanbaru", alamat: "Jl. Kulim No.7", telepon: "08123456705", status: "Aktif" },
  { id: 6, nama: "Laundry Sukajadi", kota: "Pekanbaru", alamat: "Jl. Sukajadi No.22", telepon: "08123456706", status: "Aktif" },
  { id: 7, nama: "Laundry Tangkerang", kota: "Pekanbaru", alamat: "Jl. Tangkerang", telepon: "08123456707", status: "Aktif" },
  { id: 8, nama: "Laundry Ujung", kota: "Pekanbaru", alamat: "Jl. Ujung No.3", telepon: "08123456708", status: "Aktif" },
  { id: 9, nama: "Laundry Minas", kota: "Pekanbaru", alamat: "Jl. Minas No.18", telepon: "08123456709", status: "Aktif" },
  { id: 10, nama: "Laundry Sidomulyo", kota: "Pekanbaru", alamat: "Jl. Sidomulyo", telepon: "08123456710", status: "Aktif" },
  { id: 11, nama: "Laundry Pekanbaru Kota", kota: "Pekanbaru", alamat: "Jl. Jend. Sudirman", telepon: "08123456711", status: "Aktif" },
  { id: 12, nama: "Laundry Tenayan", kota: "Pekanbaru", alamat: "Jl. Tenayan", telepon: "08123456712", status: "Aktif" },
];

export const services = [
  { id: 1, nama: "Cuci Kering", harga: 7000, estimasi: "1 Hari", status: "Aktif" },
  { id: 2, nama: "Cuci Setrika", harga: 9000, estimasi: "2 Hari", status: "Aktif" },
  { id: 3, nama: "Setrika Saja", harga: 5000, estimasi: "1 Hari", status: "Aktif" },
  { id: 4, nama: "Cuci Komplit", harga: 12000, estimasi: "2 Hari", status: "Aktif" },
  { id: 5, nama: "Express", harga: 15000, estimasi: "6 Jam", status: "Aktif" },
];

export const items = [
  { id: 1, nama: "Bed Cover", harga: 35000, status: "Aktif" },
  { id: 2, nama: "Jas", harga: 25000, status: "Aktif" },
  { id: 3, nama: "Selimut", harga: 20000, status: "Aktif" },
  { id: 4, nama: "Boneka Kecil", harga: 15000, status: "Aktif" },
  { id: 5, nama: "Sepatu", harga: 30000, status: "Aktif" },
];

export const employees = [
  { id: 1, nama: "Andi Saputra", outlet: "Laundry Panam", jabatan: "Kasir", hp: "08123456789", gaji: 3500000, status: "Aktif" },
  { id: 2, nama: "Budi Santoso", outlet: "Laundry Arengka", jabatan: "Operator", hp: "08129876543", gaji: 3000000, status: "Aktif" },
  { id: 3, nama: "Citra Dewi", outlet: "Laundry Marpoyan", jabatan: "Supervisor", hp: "081377788899", gaji: 4500000, status: "Aktif" },
  { id: 4, nama: "Dewi Lestari", outlet: "Laundry Sail", jabatan: "Kasir", hp: "081355566677", gaji: 3200000, status: "Aktif" },
  { id: 5, nama: "Eko Prasetyo", outlet: "Laundry Kulim", jabatan: "Kasir", hp: "081366677788", gaji: 3100000, status: "Aktif" },
];

export const investors = [
  { id: 1, nama: "Budi Santoso", outlet: "Laundry Panam", modal: 20000000, persentase: 30, status: "Aktif" },
  { id: 2, nama: "Andi Wijaya", outlet: "Laundry Arengka", modal: 15000000, persentase: 25, status: "Aktif" },
  { id: 3, nama: "Rina Putri", outlet: "Laundry Marpoyan", modal: 25000000, persentase: 20, status: "Aktif" },
  { id: 4, nama: "Hendra Gunawan", outlet: "Laundry Sail", modal: 18000000, persentase: 15, status: "Aktif" },
  { id: 5, nama: "Siti Aminah", outlet: "Laundry Kulim", modal: 12000000, persentase: 10, status: "Aktif" },
];

function outletSlug(nama) {
  return nama.toLowerCase().replace(/^laundry\s+/i, "").replace(/\s+/g, "");
}

/** Akun kasir — satu per outlet */
export const kasirAccounts = outlets.map((o, i) => {
  const kasirEmployee = employees.find((e) => e.outlet === o.nama && e.jabatan === "Kasir");
  const slug = outletSlug(o.nama);
  return {
    id: i + 1,
    nama: kasirEmployee?.nama ?? `Kasir ${o.nama.replace("Laundry ", "")}`,
    username: `kasir.${slug}@laundrymsn.com`,
    password: "kasir123",
    hp: kasirEmployee?.hp ?? o.telepon,
    outlet: o.nama,
    status: "Aktif",
  };
});

const now = new Date();
const today = now.toISOString().slice(0, 10);
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().slice(0, 10);
const weekAgo = new Date(now);
weekAgo.setDate(weekAgo.getDate() - 7);
const weekAgoStr = weekAgo.toISOString().slice(0, 10);

export const transactions = [
  {
    id: 1, invoice: "INV-001", customer: "Ahmad", phone: "08121111111", outlet: "Laundry Panam",
    layananType: "Kiloan", service: "Cuci Setrika", weight: 5, lineItems: [],
    subtotal: 45000, diskon: 0, total: 45000, metodePembayaran: "Tunai",
    status: "Diproses", paymentStatus: "Lunas", tanggal: yesterdayStr, finishDate: today,
    cancelled: false, kasir: "Andi Saputra", kasirId: 1,
    statusHistory: [
      { status: "Menunggu", by: "Andi Saputra", at: yesterdayStr, note: "Transaksi dibuat" },
      { status: "Diproses", by: "Andi Saputra", at: yesterdayStr, note: "Cucian mulai diproses" },
    ],
  },
  {
    id: 2, invoice: "INV-002", customer: "Budi", phone: "08122222222", outlet: "Laundry Arengka",
    layananType: "Kiloan", service: "Express", weight: 3, lineItems: [],
    subtotal: 45000, diskon: 5000, total: 40000, metodePembayaran: "QRIS",
    status: "Selesai", paymentStatus: "Lunas", tanggal: yesterdayStr, finishDate: yesterdayStr,
    cancelled: false, kasir: "Budi Santoso", kasirId: 2,
    statusHistory: [
      { status: "Menunggu", by: "Budi Santoso", at: yesterdayStr, note: "Transaksi dibuat" },
      { status: "Diproses", by: "Budi Santoso", at: yesterdayStr, note: "Diproses express" },
      { status: "Selesai", by: "Budi Santoso", at: yesterdayStr, note: "Selesai & diambil" },
    ],
  },
  {
    id: 3, invoice: "INV-003", customer: "Siti", phone: "08123333333", outlet: "Laundry Marpoyan",
    layananType: "Satuan", service: "", weight: 0,
    lineItems: [
      { itemId: 1, nama: "Bed Cover", qty: 2, harga: 35000, subtotal: 70000 },
      { itemId: 2, nama: "Jas", qty: 1, harga: 25000, subtotal: 25000 },
    ],
    subtotal: 95000, diskon: 0, total: 95000, metodePembayaran: "Transfer",
    status: "Menunggu", paymentStatus: "DP", tanggal: today, finishDate: null,
    cancelled: false, kasir: "Citra Dewi", kasirId: 3,
    statusHistory: [{ status: "Menunggu", by: "Citra Dewi", at: today, note: "Transaksi dibuat" }],
  },
  {
    id: 4, invoice: "INV-004", customer: "Rina", phone: "08124444444", outlet: "Laundry Panam",
    layananType: "Kiloan", service: "Cuci Komplit", weight: 4, lineItems: [],
    subtotal: 48000, diskon: 3000, total: 45000, metodePembayaran: "Tunai",
    status: "Selesai", paymentStatus: "Lunas", tanggal: today, finishDate: today,
    cancelled: false, kasir: "Andi Saputra", kasirId: 1,
    statusHistory: [
      { status: "Menunggu", by: "Andi Saputra", at: today, note: "Transaksi dibuat" },
      { status: "Diproses", by: "Andi Saputra", at: today, note: "Sedang dicuci" },
      { status: "Selesai", by: "Andi Saputra", at: today, note: "Selesai" },
    ],
  },
  {
    id: 5, invoice: "INV-005", customer: "Joko", phone: "08125555555", outlet: "Laundry Sail",
    layananType: "Kiloan", service: "Setrika Saja", weight: 2, lineItems: [],
    subtotal: 10000, diskon: 0, total: 10000, metodePembayaran: "Tunai",
    status: "Dibatalkan", paymentStatus: "Refund", tanggal: weekAgoStr, finishDate: null,
    cancelled: true, kasir: "Dewi Lestari", kasirId: 4,
    statusHistory: [{ status: "Menunggu", by: "Dewi Lestari", at: weekAgoStr, note: "Transaksi dibuat" }],
  },
  {
    id: 6, invoice: "INV-006", customer: "Dewi", phone: "08126666666", outlet: "Laundry Panam",
    layananType: "Satuan", service: "", weight: 0,
    lineItems: [{ itemId: 5, nama: "Sepatu", qty: 2, harga: 30000, subtotal: 60000 }],
    subtotal: 60000, diskon: 0, total: 60000, metodePembayaran: "Debit",
    status: "Selesai", paymentStatus: "Lunas", tanggal: weekAgoStr, finishDate: weekAgoStr,
    cancelled: false, kasir: "Andi Saputra", kasirId: 1,
    statusHistory: [
      { status: "Menunggu", by: "Andi Saputra", at: weekAgoStr, note: "Transaksi dibuat" },
      { status: "Selesai", by: "Andi Saputra", at: weekAgoStr, note: "Selesai" },
    ],
  },
  {
    id: 7, invoice: "INV-007", customer: "Eko", phone: "08127777777", outlet: "Laundry Arengka",
    layananType: "Kiloan", service: "Cuci Kering", weight: 6, lineItems: [],
    subtotal: 42000, diskon: 0, total: 42000, metodePembayaran: "Tunai",
    status: "Selesai", paymentStatus: "Lunas", tanggal: weekAgoStr, finishDate: weekAgoStr,
    cancelled: false, kasir: "Budi Santoso", kasirId: 2,
    statusHistory: [{ status: "Selesai", by: "Budi Santoso", at: weekAgoStr, note: "Selesai" }],
  },
  {
    id: 8, invoice: "INV-008", customer: "Fitri", phone: "08128888888", outlet: "Laundry Kulim",
    layananType: "Satuan", service: "", weight: 0,
    lineItems: [
      { itemId: 3, nama: "Selimut", qty: 3, harga: 20000, subtotal: 60000 },
      { itemId: 4, nama: "Boneka Kecil", qty: 2, harga: 15000, subtotal: 30000 },
    ],
    subtotal: 90000, diskon: 10000, total: 80000, metodePembayaran: "Transfer",
    status: "Diproses", paymentStatus: "Lunas", tanggal: today, finishDate: null,
    cancelled: false, kasir: "Eko Prasetyo", kasirId: 5,
    statusHistory: [
      { status: "Menunggu", by: "Eko Prasetyo", at: today, note: "Transaksi dibuat" },
      { status: "Diproses", by: "Eko Prasetyo", at: today, note: "Sedang diproses" },
    ],
  },
];

export const stocks = [
  { id: 1, nama: "Deterjen Rinso", kategori: "Bahan Cuci", outlet: "Laundry Panam", stok: 25, satuan: "Kg" },
  { id: 2, nama: "Pewangi Downy", kategori: "Pewangi", outlet: "Laundry Panam", stok: 10, satuan: "Liter" },
  { id: 3, nama: "Plastik Laundry", kategori: "Kemasan", outlet: "Laundry Arengka", stok: 3, satuan: "Pack" },
  { id: 4, nama: "Hanger", kategori: "Peralatan", outlet: "Laundry Marpoyan", stok: 50, satuan: "Pcs" },
  { id: 5, nama: "Deterjen Rinso", kategori: "Bahan Cuci", outlet: "Laundry Arengka", stok: 18, satuan: "Kg" },
];

export const expenses = [
  { id: 1, tanggal: "2026-06-10", kategori: "Pembelian Deterjen", outlet: "Laundry Panam", nominal: 500000, keterangan: "Stok deterjen bulanan" },
  { id: 2, tanggal: "2026-06-11", kategori: "Listrik", outlet: "Laundry Arengka", nominal: 1200000, keterangan: "Tagihan listrik" },
  { id: 3, tanggal: "2026-06-12", kategori: "Pewangi", outlet: "Laundry Panam", nominal: 300000, keterangan: "Pembelian pewangi" },
  { id: 4, tanggal: "2026-06-12", kategori: "Gaji Karyawan", outlet: "Laundry Marpoyan", nominal: 3500000, keterangan: "Gaji bulan Juni" },
];

export const materialUsage = [
  { id: 1, tanggal: "2026-06-10", outlet: "Laundry Panam", bahan: "Deterjen Rinso", jumlah: 2, satuan: "Kg", keterangan: "Pemakaian harian" },
  { id: 2, tanggal: "2026-06-10", outlet: "Laundry Panam", bahan: "Pewangi Downy", jumlah: 0.5, satuan: "Liter", keterangan: "Pemakaian harian" },
  { id: 3, tanggal: "2026-06-11", outlet: "Laundry Arengka", bahan: "Plastik Laundry", jumlah: 1, satuan: "Pack", keterangan: "Kemasan pelanggan" },
];

export const salaryRecords = [
  { id: 1, bulan: "Juni 2026", karyawan: "Andi Saputra", outlet: "Laundry Panam", gaji: 3500000, status: "Dibayar", tanggalBayar: "2026-06-05" },
  { id: 2, bulan: "Juni 2026", karyawan: "Budi Santoso", outlet: "Laundry Arengka", gaji: 3000000, status: "Dibayar", tanggalBayar: "2026-06-05" },
  { id: 3, bulan: "Juni 2026", karyawan: "Citra Dewi", outlet: "Laundry Marpoyan", gaji: 4500000, status: "Belum Dibayar", tanggalBayar: null },
];

export const dailyReports = [
  { id: 1, tanggal: "2026-06-10", outlet: "Laundry Panam", kasir: "Andi Saputra", pemasukan: 1250000, pengeluaran: 150000, totalTransaksi: 18, catatan: "Operasional normal", status: "Submitted" },
  { id: 2, tanggal: "2026-06-10", outlet: "Laundry Arengka", kasir: "Budi Santoso", pemasukan: 980000, pengeluaran: 80000, totalTransaksi: 14, catatan: "Stok pewangi menipis", status: "Submitted" },
  { id: 3, tanggal: "2026-06-11", outlet: "Laundry Panam", kasir: "Andi Saputra", pemasukan: 0, pengeluaran: 0, totalTransaksi: 0, catatan: "", status: "Draft" },
];

export const monthlyRevenue = {
  labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
  pendapatan: [28000000, 31000000, 29500000, 33000000, 34500000, 35000000],
  pengeluaran: [8500000, 9200000, 8800000, 9500000, 9800000, 9900000],
};

export const outletPerformance = [
  { outlet: "Laundry Panam", pendapatan: 12500000 },
  { outlet: "Laundry Arengka", pendapatan: 9800000 },
  { outlet: "Laundry Marpoyan", pendapatan: 7300000 },
  { outlet: "Laundry Sail", pendapatan: 6200000 },
  { outlet: "Laundry Kulim", pendapatan: 5100000 },
];

export function formatRupiah(value) {
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

export function getDashboardStats() {
  const activeTransactions = transactions.filter((t) => !t.cancelled);
  const omsetBulan = activeTransactions.reduce((sum, t) => sum + t.total, 0);

  return {
    totalOutlet: outlets.length,
    totalKaryawan: employees.length,
    totalInvestor: investors.length,
    omsetBulanIni: omsetBulan + 34855000,
    totalTransaksi: activeTransactions.length + 120,
    transaksiDiproses: activeTransactions.filter((t) => t.status === "Diproses").length + 15,
    selesaiHariIni: 32,
  };
}

export function getOutletReport() {
  return outletPerformance.map((item, index) => ({
    id: index + 1,
    outlet: item.outlet,
    pendapatan: item.pendapatan,
    pengeluaran: Math.round(item.pendapatan * 0.28),
  }));
}

export function getInvestorShare(labaBersih) {
  return investors.map((inv) => ({
    ...inv,
    bagiHasil: Math.round(labaBersih * (inv.persentase / 100)),
  }));
}

export function getOutletReportByOutlets(outletNames) {
  if (!outletNames?.length) return [];
  const allowed = new Set(outletNames);
  return getOutletReport().filter((item) => allowed.has(item.outlet));
}

export function getInvestorById(investorId) {
  return investors.find((inv) => inv.id === investorId) ?? null;
}

export function calcBagiHasil(labaBersih, persentase) {
  return Math.round(labaBersih * (persentase / 100));
}
