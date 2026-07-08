import { useState } from "react";
import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
  Receipt,
  Package,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { RevenueBarChart, RevenueLineChart } from "@/components/charts/RevenueChart";
import {
  getDashboardStats,
  getInvestorById,
  calcBagiHasil,
  investors,
  monthlyRevenue,
  outletPerformance,
  transactions as initialTx,
  dailyReports as initialDaily,
  formatRupiah,
} from "@/data/laundryData";
import { getCurrentUser, getInvestedOutlets } from "@/services/authService";
import { useLocalData } from "@/hooks/useLocalData";
import {
  buildFinancialSummary,
  calcGrowthPercent,
  getDateRange,
  getPreviousPeriodRange,
  groupByDate,
  groupByOutlet,
} from "@/utils/reportUtils";
import { ROUTES } from "@/router/paths";

/* ─────────────────────────────────────────────────────────────────
   INVESTOR DASHBOARD — Premium redesign
───────────────────────────────────────────────────────────────── */
function InvestorDashboard() {
  const user = getCurrentUser();
  const investedOutlets = getInvestedOutlets();
  const investorRecord = getInvestorById(user?.investorId);
  const { data: txData } = useLocalData("transactions", initialTx);
  const [filterOutlet, setFilterOutlet] = useState("");

  const outletFilter = filterOutlet ? [filterOutlet] : investedOutlets;
  const range = getDateRange("bulanan");
  const summary = buildFinancialSummary(txData, [], { ...range, outlets: outletFilter });
  const prevSummary = buildFinancialSummary(txData, [], {
    ...getPreviousPeriodRange("bulanan"),
    outlets: outletFilter,
  });

  const persentase = investorRecord?.persentase ?? 0;
  const bagiHasil = calcBagiHasil(summary.labaBersih, persentase);
  const growth = calcGrowthPercent(summary.pendapatan, prevSummary.pendapatan);
  const perOutlet = groupByOutlet(summary.transactions);
  const dailyData = groupByDate(summary.transactions);

  const recentTx = txData
    .filter((t) => !t.cancelled && outletFilter.includes(t.outlet))
    .slice(-5)
    .reverse();

  const statCards = [
    {
      title: "Total Pendapatan",
      value: formatRupiah(summary.pendapatan),
      sub: `${growth >= 0 ? "+" : ""}${growth}% vs bulan lalu`,
      subColor: growth >= 0 ? "text-emerald-600" : "text-red-500",
      icon: TrendingUp,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Transaksi",
      value: summary.totalTransaksi,
      sub: "Bulan ini",
      subColor: "text-slate-400",
      icon: Receipt,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Pelanggan Aktif",
      value: summary.totalPelanggan,
      sub: "Pelanggan unik",
      subColor: "text-slate-400",
      icon: Users,
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: `Bagi Hasil (${persentase}%)`,
      value: formatRupiah(bagiHasil),
      sub: "Estimasi bulan ini",
      subColor: "text-cyan-600",
      icon: Wallet,
      bg: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
  ];

  const barColors = [
    "from-cyan-400 to-blue-500",
    "from-violet-400 to-purple-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
  ];

  return (
    <div className="space-y-6">

      {/* ── Hero Header ─────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-8 shadow-xl">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-cyan-200 text-sm font-semibold uppercase tracking-widest mb-1">
              Dashboard Investor
            </p>
            <h1 className="text-3xl font-extrabold text-white drop-shadow">
              Selamat Datang, {user?.name ?? "Investor"} 👋
            </h1>
            <p className="text-blue-200 mt-1 text-sm">
              Outlet investasi:{" "}
              <span className="text-white font-semibold">
                {investedOutlets.join(" • ") || "—"}
              </span>
            </p>
          </div>

          {investedOutlets.length > 1 && (
            <select
              value={filterOutlet}
              onChange={(e) => setFilterOutlet(e.target.value)}
              className="bg-white/20 backdrop-blur text-white border border-white/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="" className="text-slate-800 bg-white">Semua Outlet</option>
              {investedOutlets.map((o) => (
                <option key={o} value={o} className="text-slate-800 bg-white">{o}</option>
              ))}
            </select>
          )}
        </div>

        {/* mini stats row inside hero */}
        {investorRecord && (
          <div className="relative mt-6 flex flex-wrap gap-3">
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[110px]">
              <p className="text-blue-200 text-xs uppercase tracking-wide font-medium">Modal</p>
              <p className="text-white font-bold text-base mt-0.5">{formatRupiah(investorRecord.modal)}</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[110px]">
              <p className="text-blue-200 text-xs uppercase tracking-wide font-medium">Kepemilikan</p>
              <p className="text-white font-bold text-base mt-0.5">{investorRecord.persentase}%</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[110px]">
              <p className="text-blue-200 text-xs uppercase tracking-wide font-medium">Laba Bersih</p>
              <p className="text-white font-bold text-base mt-0.5">{formatRupiah(summary.labaBersih)}</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[110px]">
              <p className="text-blue-200 text-xs uppercase tracking-wide font-medium">Status</p>
              <p className="text-white font-bold text-base mt-0.5">{investorRecord.status}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex items-start gap-4 border border-slate-100"
            >
              <div
                className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={22} className={card.iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 text-sm">{card.title}</p>
                <p className="text-2xl font-extrabold text-slate-800 mt-1 truncate">{card.value}</p>
                <p className={`text-xs mt-1 font-medium ${card.subColor}`}>{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts ──────────────────────────────────────────────────── */}
      <div className="grid xl:grid-cols-2 gap-5">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h3 className="font-bold text-slate-700 text-lg">Grafik Pertumbuhan Pendapatan</h3>
          </div>
          {dailyData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3">
              <TrendingUp size={48} strokeWidth={1.5} />
              <p className="text-sm text-slate-400">Belum ada data transaksi bulan ini</p>
            </div>
          ) : (
            <RevenueLineChart
              labels={dailyData.map((d) => d.tanggal.slice(5))}
              pendapatan={dailyData.map((d) => d.pendapatan)}
            />
          )}
        </div>

        {/* Outlet breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-violet-400 to-purple-500" />
            <h3 className="font-bold text-slate-700 text-lg">Pendapatan Per Outlet</h3>
          </div>
          {perOutlet.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3">
              <Building2 size={48} strokeWidth={1.5} />
              <p className="text-sm text-slate-400">Belum ada data pendapatan outlet</p>
            </div>
          ) : (
            <div className="space-y-5 pt-1">
              {perOutlet.map((item, idx) => {
                const maxPendapatan = perOutlet[0]?.pendapatan || 1;
                const pct = Math.round((item.pendapatan / maxPendapatan) * 100);
                return (
                  <div key={item.outlet}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-slate-700">{item.outlet}</span>
                      <span className="font-bold text-slate-800">{formatRupiah(item.pendapatan)}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColors[idx % barColors.length]} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.transaksi} transaksi</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Transactions ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
            <h3 className="font-bold text-slate-700 text-lg">Transaksi Terbaru</h3>
          </div>
          <Link
            to={ROUTES.INVESTOR_REPORTS}
            className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold hover:underline transition-colors"
          >
            Lihat laporan lengkap →
          </Link>
        </div>

        {recentTx.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300 gap-3">
            <Receipt size={48} strokeWidth={1.5} />
            <p className="text-sm text-slate-400">Belum ada transaksi bulan ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Invoice", "Pelanggan", "Outlet", "Total", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-2 text-slate-400 font-semibold uppercase tracking-wide text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTx.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-2 font-mono text-slate-600 font-semibold">{t.invoice}</td>
                    <td className="py-3 px-2 text-slate-700">{t.customer}</td>
                    <td className="py-3 px-2 text-slate-500">{t.outlet}</td>
                    <td className="py-3 px-2 font-bold text-slate-800">{formatRupiah(t.total)}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          t.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-700"
                            : t.status === "Diproses"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   KASIR DASHBOARD — unchanged
───────────────────────────────────────────────────────────────── */
function KasirDashboard() {
  const user = getCurrentUser();
  const outlet = user?.outlet ?? "Laundry Panam";
  const { data: txData } = useLocalData("transactions", initialTx);
  const { data: reports } = useLocalData("dailyReports", initialDaily);

  const outletTransactions = txData.filter((t) => t.outlet === outlet && !t.cancelled);
  const pemasukanHariIni = outletTransactions.reduce((sum, t) => sum + t.total, 0);
  const draftReport = reports.find((r) => r.outlet === outlet && r.status === "Draft");

  const quickLinks = [
    { label: "Transaksi Baru", path: ROUTES.TRANSACTIONS, icon: Receipt },
    { label: "Pengeluaran", path: ROUTES.EXPENSES, icon: Wallet },
    { label: "Update Stok", path: ROUTES.STOCKS, icon: Package },
    { label: "Laporan Harian", path: ROUTES.DAILY_REPORTS, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Kasir</h1>
        <p className="text-slate-500">Selamat datang, {user?.name} — {outlet}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Transaksi Aktif</p>
          <h2 className="text-3xl font-bold mt-2">{outletTransactions.length}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Pemasukan</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">{formatRupiah(pemasukanHariIni)}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Laporan Harian</p>
          <h2 className="text-3xl font-bold mt-2">{draftReport ? "Belum Submit" : "Selesai"}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center gap-3 hover:scale-105 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Icon className="text-cyan-600" />
              </div>
              <span className="text-sm font-medium text-center">{link.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4">Transaksi Terbaru — {outlet}</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Invoice</th>
              <th className="text-left py-3">Pelanggan</th>
              <th className="text-left py-3">Total</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {outletTransactions.slice(0, 5).map((t) => (
              <tr key={t.id} className="border-b">
                <td className="py-3">{t.invoice}</td>
                <td>{t.customer}</td>
                <td>{formatRupiah(t.total)}</td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ADMIN DASHBOARD — unchanged
───────────────────────────────────────────────────────────────── */
function AdminDashboard() {
  const { data: txData } = useLocalData("transactions", initialTx);
  const stats = getDashboardStats();
  const recentTransactions = txData.filter((t) => !t.cancelled).slice(0, 5);

  const statCards = [
    { title: "Total Outlet", value: String(stats.totalOutlet), icon: Building2 },
    { title: "Total Karyawan", value: String(stats.totalKaryawan), icon: Users },
    { title: "Investor Aktif", value: String(stats.totalInvestor), icon: Wallet },
    { title: "Omset Bulan Ini", value: formatRupiah(stats.omsetBulanIni), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Ringkasan seluruh aktivitas laundry multi cabang</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center"
            >
              <div>
                <p className="text-slate-500">{item.title}</p>
                <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
              </div>
              <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Icon size={28} className="text-cyan-600" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Pendapatan Bulanan</h3>
          <RevenueLineChart
            labels={monthlyRevenue.labels}
            pendapatan={monthlyRevenue.pendapatan}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Pendapatan vs Pengeluaran</h3>
          <RevenueBarChart
            labels={monthlyRevenue.labels}
            pendapatan={monthlyRevenue.pendapatan}
            pengeluaran={monthlyRevenue.pengeluaran}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Top Outlet</h3>
          <div className="space-y-3">
            {outletPerformance.map((item) => (
              <div key={item.outlet} className="flex justify-between">
                <span>{item.outlet}</span>
                <span className="font-semibold">{formatRupiah(item.pendapatan)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Investor Aktif</h3>
          <div className="space-y-3">
            {investors.slice(0, 5).map((inv) => (
              <div key={inv.id} className="flex justify-between">
                <span>{inv.nama}</span>
                <span>{inv.persentase}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4">Transaksi Terbaru</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Invoice</th>
              <th className="text-left py-3">Pelanggan</th>
              <th className="text-left py-3">Outlet</th>
              <th className="text-left py-3">Total</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="py-3">{t.invoice}</td>
                <td>{t.customer}</td>
                <td>{t.outlet}</td>
                <td>{formatRupiah(t.total)}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      t.status === "Selesai"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Diproses"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ROOT EXPORT — role-based routing
───────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const user = getCurrentUser();

  if (user?.role === "kasir") return <KasirDashboard />;
  if (user?.role === "investor") return <InvestorDashboard />;
  return <AdminDashboard />;
}
