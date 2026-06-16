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
  getOutletReportByOutlets,
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
import { ROUTES } from "@/router/paths";

function InvestorDashboard() {
  const user = getCurrentUser();
  const investedOutlets = getInvestedOutlets();
  const investorRecord = getInvestorById(user?.investorId);
  const laporan = getOutletReportByOutlets(investedOutlets);
  const totalPendapatan = laporan.reduce((a, b) => a + b.pendapatan, 0);
  const totalPengeluaran = laporan.reduce((a, b) => a + b.pengeluaran, 0);
  const labaBersih = totalPendapatan - totalPengeluaran;
  const persentase = investorRecord?.persentase ?? 0;
  const bagiHasil = calcBagiHasil(labaBersih, persentase);
  const outletLabel = investedOutlets.join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Investor</h1>
        <p className="text-slate-500">
          Ringkasan keuntungan investasi Anda — {outletLabel || "belum ada outlet"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Laba Bersih Outlet Anda</p>
          <h2 className="text-3xl font-bold text-cyan-600 mt-2">
            {formatRupiah(labaBersih)}
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Porsi Saham Anda</p>
          <h2 className="text-3xl font-bold mt-2">{persentase}%</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Bagi Hasil Bulan Ini</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {formatRupiah(bagiHasil)}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4">Laporan Outlet Investasi Anda</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Outlet</th>
              <th className="text-left py-3">Pendapatan</th>
              <th className="text-left py-3">Pengeluaran</th>
              <th className="text-left py-3">Laba Bersih</th>
              <th className="text-left py-3">Bagi Hasil Anda</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item) => {
              const labaOutlet = item.pendapatan - item.pengeluaran;
              return (
                <tr key={item.id} className="border-b">
                  <td className="py-3 font-medium">{item.outlet}</td>
                  <td className="text-green-600">{formatRupiah(item.pendapatan)}</td>
                  <td className="text-red-600">{formatRupiah(item.pengeluaran)}</td>
                  <td className="text-cyan-600 font-semibold">
                    {formatRupiah(labaOutlet)}
                  </td>
                  <td className="text-green-600 font-semibold">
                    {formatRupiah(calcBagiHasil(labaOutlet, persentase))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {investorRecord && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Detail Investasi Anda</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Modal Investasi</p>
              <p className="font-semibold text-lg">{formatRupiah(investorRecord.modal)}</p>
            </div>
            <div>
              <p className="text-slate-500">Kepemilikan Saham</p>
              <p className="font-semibold text-lg">{investorRecord.persentase}%</p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-semibold text-lg">{investorRecord.status}</p>
            </div>
          </div>
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
