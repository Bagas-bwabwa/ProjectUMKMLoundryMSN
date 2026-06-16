import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  TrendingUp, TrendingDown, BarChart3, Users, Receipt, Calendar,
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
  const { data: txData } = useLocalData("transactions", initialTx);

  const [tab, setTab] = useState("harian");
  const [filterOutlet, setFilterOutlet] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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
        <StatCard label="Jumlah Pelanggan" value={String(summary.totalPelanggan)} icon={Users} />
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
    </div>
  );
}
