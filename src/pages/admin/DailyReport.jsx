import { useState } from "react";
import { Plus, Search, FileText, Lock } from "lucide-react";
import { dailyReports, formatRupiah } from "@/data/laundryData";
import { getCurrentUser } from "@/services/authService";

export default function DailyReportPage() {
  const user = getCurrentUser();
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState(dailyReports);

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.outlet.toLowerCase().includes(search.toLowerCase()) ||
      r.kasir.toLowerCase().includes(search.toLowerCase());
    const matchOutlet = user?.role === "kasir" ? r.outlet === user.outlet : true;
    return matchSearch && matchOutlet;
  });

  function handleSubmit(id) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Submitted", catatan: r.catatan || "Laporan closing harian" } : r
      )
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Laporan Harian</h1>
          <p className="text-slate-500">
            Laporan closing outlet sebelum tutup operasional
          </p>
        </div>
        {user?.role !== "investor" && (
          <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition">
            <Plus size={18} />
            Buat Laporan
          </button>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Lock className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-800">
          Laporan yang sudah disubmit tidak dapat diubah (QL12). Pastikan data pemasukan,
          pengeluaran, dan catatan operasional sudah benar sebelum submit.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md mb-5">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari outlet atau kasir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Tanggal</th>
              <th className="p-4 text-left">Outlet</th>
              <th className="p-4 text-left">Kasir</th>
              <th className="p-4 text-left">Pemasukan</th>
              <th className="p-4 text-left">Pengeluaran</th>
              <th className="p-4 text-left">Transaksi</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={report.id} className="border-t hover:bg-slate-50">
                <td className="p-4">{report.tanggal}</td>
                <td className="p-4 font-medium">{report.outlet}</td>
                <td className="p-4">{report.kasir}</td>
                <td className="p-4 text-green-600 font-semibold">
                  {formatRupiah(report.pemasukan)}
                </td>
                <td className="p-4 text-red-600 font-semibold">
                  {formatRupiah(report.pengeluaran)}
                </td>
                <td className="p-4">{report.totalTransaksi}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      report.status === "Submitted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status === "Submitted" ? "Terkunci" : "Draft"}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {report.status === "Draft" && user?.role !== "investor" ? (
                    <button
                      onClick={() => handleSubmit(report.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600"
                    >
                      <FileText size={16} />
                      Submit
                    </button>
                  ) : (
                    <span className="text-slate-400 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
