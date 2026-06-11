import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Receipt,
  Download,
} from "lucide-react";
import { RevenueBarChart } from "@/components/charts/RevenueChart";
import {
  getOutletReport,
  getInvestorShare,
  monthlyRevenue,
  formatRupiah,
} from "@/data/laundryData";

export default function ReportPage() {
  const [periode, setPeriode] = useState("bulanan");
  const laporanOutlet = getOutletReport();

  const totalPendapatan = laporanOutlet.reduce((a, b) => a + b.pendapatan, 0);
  const totalPengeluaran = laporanOutlet.reduce((a, b) => a + b.pengeluaran, 0);
  const labaBersih = totalPendapatan - totalPengeluaran;
  const bagiHasil = getInvestorShare(labaBersih);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Laporan Keuangan</h1>
          <p className="text-slate-500">Ringkasan seluruh aktivitas bisnis laundry</p>
        </div>
        <div className="flex gap-3">
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
          </select>
          <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-500">Pendapatan</p>
              <h2 className="text-2xl font-bold text-green-600">
                {formatRupiah(totalPendapatan)}
              </h2>
            </div>
            <TrendingUp className="text-green-500" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-500">Pengeluaran</p>
              <h2 className="text-2xl font-bold text-red-600">
                {formatRupiah(totalPengeluaran)}
              </h2>
            </div>
            <Wallet className="text-red-500" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-500">Laba Bersih</p>
              <h2 className="text-2xl font-bold text-cyan-600">
                {formatRupiah(labaBersih)}
              </h2>
            </div>
            <BarChart3 className="text-cyan-500" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-500">Periode</p>
              <h2 className="text-2xl font-bold capitalize">{periode}</h2>
            </div>
            <Receipt className="text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="font-bold text-xl mb-4">Grafik Pendapatan Bulanan</h2>
        <RevenueBarChart
          labels={monthlyRevenue.labels}
          pendapatan={monthlyRevenue.pendapatan}
          pengeluaran={monthlyRevenue.pengeluaran}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="p-5 border-b">
          <h2 className="font-bold text-xl">Laporan Per Outlet</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Outlet</th>
              <th className="p-4 text-left">Pendapatan</th>
              <th className="p-4 text-left">Pengeluaran</th>
              <th className="p-4 text-left">Laba Bersih</th>
            </tr>
          </thead>
          <tbody>
            {laporanOutlet.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4 font-medium">{item.outlet}</td>
                <td className="p-4 text-green-600 font-semibold">
                  {formatRupiah(item.pendapatan)}
                </td>
                <td className="p-4 text-red-600 font-semibold">
                  {formatRupiah(item.pengeluaran)}
                </td>
                <td className="p-4 text-cyan-600 font-bold">
                  {formatRupiah(item.pendapatan - item.pengeluaran)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-bold text-xl">Bagi Hasil Investor</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Investor</th>
              <th className="p-4 text-left">Saham</th>
              <th className="p-4 text-left">Hak Bagi Hasil</th>
            </tr>
          </thead>
          <tbody>
            {bagiHasil.map((inv) => (
              <tr key={inv.id} className="border-t">
                <td className="p-4">{inv.nama}</td>
                <td className="p-4">{inv.persentase}%</td>
                <td className="p-4 text-green-600 font-semibold">
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
