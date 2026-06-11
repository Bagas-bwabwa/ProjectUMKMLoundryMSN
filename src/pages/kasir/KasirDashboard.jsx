import { Receipt, Wallet, Package, FileText } from "lucide-react";
import { getCurrentUser } from "@/services/authService";
import { transactions, dailyReports, formatRupiah } from "@/data/laundryData";
import { Link } from "react-router-dom";
import { ROUTES } from "@/router/paths";

export default function KasirDashboard() {
  const user = getCurrentUser();
  const outlet = user?.outlet ?? "Laundry Panam";

  const outletTransactions = transactions.filter(
    (t) => t.outlet === outlet && !t.cancelled
  );
  const pemasukanHariIni = outletTransactions.reduce((sum, t) => sum + t.total, 0);
  const draftReport = dailyReports.find(
    (r) => r.outlet === outlet && r.status === "Draft"
  );

  const quickLinks = [
    { label: "Transaksi Baru", path: `${ROUTES.TRANSACTIONS}/create`, icon: Receipt },
    { label: "Pengeluaran", path: ROUTES.EXPENSES, icon: Wallet },
    { label: "Update Stok", path: ROUTES.STOCKS, icon: Package },
    { label: "Laporan Harian", path: ROUTES.DAILY_REPORTS, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Kasir</h1>
        <p className="text-slate-500">
          Selamat datang, {user?.name} — {outlet}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Transaksi Aktif</p>
          <h2 className="text-3xl font-bold mt-2">{outletTransactions.length}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Pemasukan Hari Ini</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {formatRupiah(pemasukanHariIni)}
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Laporan Harian</p>
          <h2 className="text-3xl font-bold mt-2">
            {draftReport ? "Belum Submit" : "Selesai"}
          </h2>
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
