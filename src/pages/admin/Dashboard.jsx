import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { RevenueBarChart, RevenueLineChart } from "@/components/charts/RevenueChart";
import {
  getDashboardStats,
  getOutletReport,
  getInvestorShare,
  investors,
  monthlyRevenue,
  outletPerformance,
  transactions,
  formatRupiah,
} from "@/data/laundryData";
import { getCurrentUser } from "@/services/authService";
import KasirDashboard from "@/pages/kasir/KasirDashboard";

function InvestorDashboard() {
  const laporan = getOutletReport();
  const totalPendapatan = laporan.reduce((a, b) => a + b.pendapatan, 0);
  const totalPengeluaran = laporan.reduce((a, b) => a + b.pengeluaran, 0);
  const labaBersih = totalPendapatan - totalPengeluaran;
  const bagiHasil = getInvestorShare(labaBersih);
  const user = getCurrentUser();
  const myShare = bagiHasil.find((i) => i.nama === user?.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Investor</h1>
        <p className="text-slate-500">Ringkasan keuntungan investasi Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Laba Bersih Bulan Ini</p>
          <h2 className="text-3xl font-bold text-cyan-600 mt-2">
            {formatRupiah(labaBersih)}
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Porsi Saham Anda</p>
          <h2 className="text-3xl font-bold mt-2">{myShare?.persentase ?? 0}%</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Bagi Hasil Bulan Ini</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {formatRupiah(myShare?.bagiHasil ?? 0)}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4">Pembagian Keuntungan Semua Investor</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Investor</th>
              <th className="text-left py-3">Saham</th>
              <th className="text-left py-3">Bagi Hasil</th>
            </tr>
          </thead>
          <tbody>
            {bagiHasil.map((inv) => (
              <tr key={inv.id} className="border-b">
                <td className="py-3">{inv.nama}</td>
                <td>{inv.persentase}%</td>
                <td className="text-green-600 font-semibold">
                  {formatRupiah(inv.bagiHasil)}
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
  const stats = getDashboardStats();
  const recentTransactions = transactions.filter((t) => !t.cancelled).slice(0, 5);

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
