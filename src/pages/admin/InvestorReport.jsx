import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  TrendingUp, TrendingDown, BarChart3, Users, Receipt, Calendar, Download,
} from "lucide-react";
import { RevenueBarChart, RevenueLineChart } from "@/components/charts/RevenueChart";
import { useLocalData } from "@/hooks/useLocalData";
import {
  transactions as initialTx,
  formatRupiah,
  getInvestorById,
  calcBagiHasil,
} from "@/data/laundryData";
import { getCurrentUser, getInvestedOutlets } from "@/services/authService";
import {
  buildFinancialSummary,
  calcGrowthPercent,
  getDateRange,
  getPreviousPeriodRange,
  getWeeklyDayLabels,
  getWeeklyRevenue,
  getMonthlyWeeks,
  groupByOutlet,
  groupByService,
  groupByDate,
} from "@/utils/reportUtils";
import { ROUTES } from "@/router/paths";
import { exportToPDF } from "@/utils/exportUtils";
import { fetchTransactionsFromApi, hasApiSession } from "@/services/transactionService";

function GrowthBadge({ value }) {
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${up ? "text-green-600" : "text-red-600"}`}>
      {up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      {up ? "+" : ""}{value}% vs periode sebelumnya
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color = "text-slate-800" }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm">{label}</p>
          <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
        </div>
        {Icon && <Icon className="text-cyan-400" size={24} />}
      </div>
    </div>
  );
}

export default function InvestorReportPage() {
  const user = getCurrentUser();
  if (user?.role !== "investor") {
    return <Navigate to={ROUTES.REPORTS} replace />;
  }

  const investedOutlets = getInvestedOutlets();
  const investorRecord = getInvestorById(user?.investorId);
  const { data: txData, setData: setTxData } = useLocalData("transactions", initialTx);

  const [tab, setTab] = useState("harian");
  const [filterOutlet, setFilterOutlet] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    let mounted = true;
    async function syncTx() {
      if (!hasApiSession()) return;
      try {
        const mapped = await fetchTransactionsFromApi();
        if (mounted && mapped.length) setTxData(mapped);
      } catch {
        // fallback: tetap pakai local data
      }
    }
    syncTx();
    return () => {
      mounted = false;
    };
  }, [setTxData]);

  const periodMap = { harian: "harian", mingguan: "mingguan", bulanan: "bulanan" };
  const periodRange = useMemo(() => {
    if (dateFrom && dateTo) return { dateFrom, dateTo };
    return getDateRange(periodMap[tab] ?? "bulanan");
  }, [tab, dateFrom, dateTo]);

  const prevRange = useMemo(() => getPreviousPeriodRange(periodMap[tab] ?? "bulanan"), [tab]);

  const outletFilter = filterOutlet
    ? [filterOutlet]
    : investedOutlets;

  const filters = useMemo(() => ({
    ...periodRange,
    outlets: outletFilter,
  }), [periodRange, outletFilter]);

  const prevFilters = useMemo(() => ({
    ...prevRange,
    outlets: outletFilter,
  }), [prevRange, outletFilter]);

  const summary = useMemo(() => buildFinancialSummary(txData, [], filters), [txData, filters]);
  const prevSummary = useMemo(() => buildFinancialSummary(txData, [], prevFilters), [txData, prevFilters]);

  const growth = {
    pendapatan: calcGrowthPercent(summary.pendapatan, prevSummary.pendapatan),
    transaksi: calcGrowthPercent(summary.totalTransaksi, prevSummary.totalTransaksi),
    pelanggan: calcGrowthPercent(summary.totalPelanggan, prevSummary.totalPelanggan),
  };

  const persentase = investorRecord?.persentase ?? 0;
  const bagiHasil = calcBagiHasil(summary.labaBersih, persentase);

  const perOutlet = groupByOutlet(summary.transactions);
  const topOutlet = perOutlet[0];
  const layananPopuler = groupByService(summary.transactions);
  const dailyBreakdown = groupByDate(summary.transactions);

  const weeklyLabels = getWeeklyDayLabels(periodRange.dateFrom);
  const weeklyRevenue = getWeeklyRevenue(txData, periodRange.dateFrom, periodRange.dateTo);
  const monthlyWeeks = getMonthlyWeeks(summary.transactions, periodRange.dateFrom, periodRange.dateTo);
  const reportLabels = dailyBreakdown.map((d) => d.tanggal);
  const reportValues = dailyBreakdown.map((d) => d.pendapatan);

  function buildPdfChart(labels, values) {
    if (!labels.length) return "<p style='font-size:12px;color:#64748b'>Belum ada data grafik pada periode ini.</p>";
    const max = Math.max(...values, 1);
    const bars = labels.map((label, idx) => {
      const height = Math.max(8, Math.round((values[idx] / max) * 110));
      const x = 40 + idx * 56;
      const y = 140 - height;
      return `
        <rect x="${x}" y="${y}" width="30" height="${height}" fill="#06b6d4" rx="4"></rect>
        <text x="${x + 15}" y="156" text-anchor="middle" font-size="9" fill="#334155">${label.slice(5)}</text>
      `;
    }).join("");
    const width = Math.max(320, labels.length * 56 + 80);
    return `
      <svg width="${width}" height="170" viewBox="0 0 ${width} 170" xmlns="http://www.w3.org/2000/svg" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
        <line x1="30" y1="140" x2="${width - 20}" y2="140" stroke="#94a3b8" stroke-width="1" />
        ${bars}
      </svg>
    `;
  }

  function handleExportInvestorPDF() {
    const printedAt = new Date().toLocaleString("id-ID");
    const periode = `${periodRange.dateFrom} s.d. ${periodRange.dateTo}`;
    const rows = summary.transactions.map((tx, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${tx.invoice}</td>
        <td>${tx.tanggal}</td>
        <td>${tx.customer}</td>
        <td>${tx.outlet}</td>
        <td>${tx.paymentStatus}</td>
        <td>${tx.layananType === "Satuan" ? tx.lineItems.reduce((s, i) => s + Number(i.qty || 0), 0) : tx.weight} ${tx.layananType === "Satuan" ? "item" : "kg"}</td>
        <td>Rp ${Number(tx.total || 0).toLocaleString("id-ID")}</td>
      </tr>
    `).join("");
    const outletLabel = filterOutlet || "Semua Outlet Investasi";
    const html = `
      <div style="font-size:12px;line-height:1.6;margin-bottom:12px">
        <p><b>Nama Outlet:</b> ${outletLabel}</p>
        <p><b>Periode Laporan:</b> ${periode}</p>
        <p><b>Tanggal Cetak:</b> ${printedAt}</p>
        <p><b>Nama Investor/Pengunduh:</b> ${user?.name ?? "Investor"}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0 16px">
        <div style="border:1px solid #e2e8f0;border-radius:8px;padding:10px"><b>Total Transaksi</b><br/>${summary.totalTransaksi}</div>
        <div style="border:1px solid #e2e8f0;border-radius:8px;padding:10px"><b>Total Pendapatan</b><br/>Rp ${Number(summary.pendapatan || 0).toLocaleString("id-ID")}</div>
        <div style="border:1px solid #e2e8f0;border-radius:8px;padding:10px"><b>Jumlah Item Laundry</b><br/>${summary.totalItemLaundry}</div>
      </div>
      <h3 style="margin:10px 0 8px">Grafik Pendapatan</h3>
      ${buildPdfChart(reportLabels, reportValues)}
      <h3 style="margin:14px 0 8px">Rincian Transaksi Selesai</h3>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr>
            <th style="border:1px solid #e2e8f0;padding:6px;background:#f1f5f9">No</th>
            <th style="border:1px solid #e2e8f0;padding:6px;background:#f1f5f9">Invoice</th>
            <th style="border:1px solid #e2e8f0;padding:6px;background:#f1f5f9">Tanggal</th>
            <th style="border:1px solid #e2e8f0;padding:6px;background:#f1f5f9">Pelanggan</th>
            <th style="border:1px solid #e2e8f0;padding:6px;background:#f1f5f9">Outlet</th>
            <th style="border:1px solid #e2e8f0;padding:6px;background:#f1f5f9">Status Bayar</th>
            <th style="border:1px solid #e2e8f0;padding:6px;background:#f1f5f9">Item/Kg</th>
            <th style="border:1px solid #e2e8f0;padding:6px;background:#f1f5f9">Total</th>
          </tr>
        </thead>
        <tbody>${rows || "<tr><td colspan='8' style='border:1px solid #e2e8f0;padding:8px;text-align:center'>Tidak ada transaksi selesai</td></tr>"}</tbody>
      </table>
    `;
    exportToPDF(`Laporan Investor ${tab.toUpperCase()}`, html);
  }

  const tabs = [
    { id: "harian", label: "Harian" },
    { id: "mingguan", label: "Mingguan" },
    { id: "bulanan", label: "Bulanan" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Laporan Investor</h1>
          <p className="text-slate-500">Outlet investasi: {investedOutlets.join(", ")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleExportInvestorPDF}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl text-sm shadow-md">
            <Download size={16} /> Export PDF
          </button>
          <select value={filterOutlet} onChange={(e) => setFilterOutlet(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm">
            <option value="">Semua Outlet Investasi</option>
            {investedOutlets.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex gap-2 border-b pb-1">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => { setTab(t.id); setDateFrom(""); setDateTo(""); }}
            className={`px-4 py-2 rounded-t-xl font-medium text-sm transition ${
              tab === t.id ? "bg-cyan-500 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Pendapatan" value={formatRupiah(summary.pendapatan)} icon={BarChart3} color="text-green-600" />
        <StatCard label="Jumlah Transaksi" value={String(summary.totalTransaksi)} icon={Receipt} />
        <StatCard label="Jumlah Item Laundry" value={String(summary.totalItemLaundry)} icon={Users} />
        <StatCard label="Bagi Hasil Anda" value={formatRupiah(bagiHasil)} icon={TrendingUp} color="text-cyan-600" />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <GrowthBadge value={growth.pendapatan} />
      </div>

      {tab === "harian" && (
        <div className="grid xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold mb-4">Grafik Pemasukan Harian</h3>
            <RevenueBarChart
              labels={dailyBreakdown.map((d) => d.tanggal.slice(5))}
              pendapatan={dailyBreakdown.map((d) => d.pendapatan)}
              pengeluaran={[]}
            />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold mb-4">Pendapatan Per Outlet</h3>
            <div className="space-y-3">
              {perOutlet.map((o) => (
                <div key={o.outlet} className="flex justify-between border-b pb-2">
                  <span>{o.outlet}</span>
                  <span className="font-semibold text-green-600">{formatRupiah(o.pendapatan)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-slate-500">
              <Calendar size={14} className="inline mr-1" />
              Transaksi: {summary.totalTransaksi} · Pelanggan: {summary.totalPelanggan}
            </div>
          </div>
        </div>
      )}

      {tab === "mingguan" && (
        <div className="grid xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold mb-4">Pendapatan Per Hari (Minggu Ini)</h3>
            <RevenueLineChart labels={weeklyLabels} pendapatan={weeklyRevenue} />
            <p className="mt-3 text-sm text-slate-500">
              Rata-rata harian: {formatRupiah(Math.round(summary.pendapatan / 7))}
            </p>
            <GrowthBadge value={growth.transaksi} />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold mb-4">Outlet Tertinggi</h3>
            {topOutlet ? (
              <div className="text-center py-6">
                <p className="text-2xl font-bold text-cyan-600">{topOutlet.outlet}</p>
                <p className="text-green-600 font-semibold mt-2">{formatRupiah(topOutlet.pendapatan)}</p>
                <p className="text-sm text-slate-500 mt-1">{topOutlet.transaksi} transaksi</p>
              </div>
            ) : (
              <p className="text-slate-500">Belum ada data</p>
            )}
          </div>
        </div>
      )}

      {tab === "bulanan" && (
        <div className="space-y-6">
          <div className="grid xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold mb-4">Pendapatan Per Minggu</h3>
              <RevenueBarChart
                labels={monthlyWeeks.map((w) => w.label)}
                pendapatan={monthlyWeeks.map((w) => w.pendapatan)}
                pengeluaran={[]}
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold mb-4">Layanan Terpopuler</h3>
              <div className="space-y-2">
                {layananPopuler.slice(0, 5).map((l) => (
                  <div key={l.layanan} className="flex justify-between">
                    <span>{l.layanan}</span>
                    <span className="font-semibold">{l.jumlah}x</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-slate-500">Total transaksi bulanan</p>
                <p className="text-2xl font-bold">{summary.totalTransaksi}</p>
                <GrowthBadge value={growth.pelanggan} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold mb-4">Performa Outlet Terbaik</h3>
            <table className="w-full">
              <thead><tr className="border-b">
                <th className="text-left py-2">Outlet</th>
                <th className="text-left py-2">Transaksi</th>
                <th className="text-left py-2">Pendapatan</th>
                <th className="text-left py-2">Bagi Hasil Anda ({persentase}%)</th>
              </tr></thead>
              <tbody>
                {perOutlet.map((o) => (
                  <tr key={o.outlet} className="border-b">
                    <td className="py-3 font-medium">{o.outlet}</td>
                    <td>{o.transaksi}</td>
                    <td className="text-green-600">{formatRupiah(o.pendapatan)}</td>
                    <td className="text-cyan-600 font-semibold">
                      {formatRupiah(calcBagiHasil(o.pendapatan, persentase))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold mb-4">Daftar Transaksi Selesai</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 text-left">Invoice</th>
                <th className="py-2 text-left">Tanggal</th>
                <th className="py-2 text-left">Pelanggan</th>
                <th className="py-2 text-left">Outlet</th>
                <th className="py-2 text-left">Status Bayar</th>
                <th className="py-2 text-left">Item/Kg</th>
                <th className="py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {summary.transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="py-2">{tx.invoice}</td>
                  <td>{tx.tanggal}</td>
                  <td>{tx.customer}</td>
                  <td>{tx.outlet}</td>
                  <td>{tx.paymentStatus}</td>
                  <td>
                    {tx.layananType === "Satuan"
                      ? `${tx.lineItems.reduce((s, i) => s + Number(i.qty || 0), 0)} item`
                      : `${tx.weight} kg`}
                  </td>
                  <td className="text-green-600 font-semibold">{formatRupiah(tx.total)}</td>
                </tr>
              ))}
              {summary.transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-slate-500">Belum ada transaksi selesai pada periode ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
