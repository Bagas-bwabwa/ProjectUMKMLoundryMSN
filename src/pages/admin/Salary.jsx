import { useState } from "react";
import { Plus, Search, Pencil, Banknote } from "lucide-react";
import { salaryRecords, formatRupiah } from "@/data/laundryData";

export default function SalaryPage() {
  const [search, setSearch] = useState("");

  const filtered = salaryRecords.filter(
    (s) =>
      s.karyawan.toLowerCase().includes(search.toLowerCase()) ||
      s.outlet.toLowerCase().includes(search.toLowerCase())
  );

  const totalGaji = salaryRecords.reduce((sum, s) => sum + s.gaji, 0);
  const sudahDibayar = salaryRecords
    .filter((s) => s.status === "Dibayar")
    .reduce((sum, s) => sum + s.gaji, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pencatatan Gaji</h1>
          <p className="text-slate-500">Kelola pembayaran gaji karyawan per outlet</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition">
          <Plus size={18} />
          Input Gaji
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">
            <Banknote className="text-cyan-600" />
          </div>
          <div>
            <p className="text-slate-500">Total Gaji Bulan Ini</p>
            <h2 className="text-2xl font-bold">{formatRupiah(totalGaji)}</h2>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Sudah Dibayar</p>
          <h2 className="text-2xl font-bold text-green-600 mt-1">
            {formatRupiah(sudahDibayar)}
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-slate-500">Belum Dibayar</p>
          <h2 className="text-2xl font-bold text-red-600 mt-1">
            {formatRupiah(totalGaji - sudahDibayar)}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md mb-5">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari karyawan atau outlet..."
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
              <th className="p-4 text-left">Bulan</th>
              <th className="p-4 text-left">Karyawan</th>
              <th className="p-4 text-left">Outlet</th>
              <th className="p-4 text-left">Gaji</th>
              <th className="p-4 text-left">Tanggal Bayar</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => (
              <tr key={record.id} className="border-t hover:bg-slate-50">
                <td className="p-4">{record.bulan}</td>
                <td className="p-4 font-medium">{record.karyawan}</td>
                <td className="p-4">{record.outlet}</td>
                <td className="p-4 font-semibold">{formatRupiah(record.gaji)}</td>
                <td className="p-4">{record.tanggalBayar ?? "—"}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      record.status === "Dibayar"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200">
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
