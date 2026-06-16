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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Investor</h1>
          <p className="text-slate-500">
            Ringkasan investasi — {investedOutlets.join(", ")}
          </p>
        </div>
        <select value={filterOutlet} onChange={(e) => setFilterOutlet(e.target.value)}
          className="border rounded-xl px-4 py-2 self-start">
          <option value="">Semua Outlet Investasi</option>
          {investedOutlets.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Total Pendapatan</p>
          <h2 className="text-2xl font-bold text-green-600 mt-2">{formatRupiah(summary.pendapatan)}</h2>
          <p className="text-xs mt-1 text-slate-500">{growth >= 0 ? "+" : ""}{growth}% vs bulan lalu</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Total Transaksi</p>
          <h2 className="text-2xl font-bold mt-2">{summary.totalTransaksi}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Pelanggan Aktif</p>
          <h2 className="text-2xl font-bold mt-2">{summary.totalPelanggan}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Bagi Hasil ({persentase}%)</p>
          <h2 className="text-2xl font-bold text-cyan-600 mt-2">{formatRupiah(bagiHasil)}</h2>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Grafik Pertumbuhan Pendapatan</h3>
          <RevenueLineChart
            labels={dailyData.map((d) => d.tanggal.slice(5))}
            pendapatan={dailyData.map((d) => d.pendapatan)}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Pendapatan Per Outlet</h3>
          <div className="space-y-3">
            {perOutlet.map((item) => (
              <div key={item.outlet} className="flex justify-between">
                <span>{item.outlet}</span>
                <span className="font-semibold text-green-600">{formatRupiah(item.pendapatan)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {investorRecord && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Detail Investasi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Modal</p>
              <p className="font-semibold text-lg">{formatRupiah(investorRecord.modal)}</p>
            </div>
            <div>
              <p className="text-slate-500">Kepemilikan</p>
              <p className="font-semibold text-lg">{investorRecord.persentase}%</p>
            </div>
            <div>
              <p className="text-slate-500">Laba Bersih</p>
              <p className="font-semibold text-lg text-cyan-600">{formatRupiah(summary.labaBersih)}</p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-semibold text-lg">{investorRecord.status}</p>
            </div>
          </div>
          <Link to={ROUTES.INVESTOR_REPORTS}
            className="inline-block mt-4 text-cyan-600 hover:underline text-sm font-medium">
            Lihat laporan lengkap →
          </Link>
        </div>
      )}
    </div>
  );
}

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

export default function Dashboard() {
  const user = getCurrentUser();

  if (user?.role === "kasir") return <KasirDashboard />;
  if (user?.role === "investor") return <InvestorDashboard />;
  return <AdminDashboard />;
}
