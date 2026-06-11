import { useState } from "react";
import { Plus, Search, Pencil, Trash2, FlaskConical } from "lucide-react";
import { materialUsage } from "@/data/laundryData";
import { getCurrentUser } from "@/services/authService";

export default function MaterialUsagePage() {
  const user = getCurrentUser();
  const [search, setSearch] = useState("");

  const filtered = materialUsage.filter((m) => {
    const matchSearch =
      m.bahan.toLowerCase().includes(search.toLowerCase()) ||
      m.outlet.toLowerCase().includes(search.toLowerCase());
    const matchOutlet = user?.role === "kasir" ? m.outlet === user.outlet : true;
    return matchSearch && matchOutlet;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pencatatan Bahan Pakai</h1>
          <p className="text-slate-500">
            Catat pemakaian deterjen, pewangi, plastik, dan bahan lainnya
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition">
          <Plus size={18} />
          Catat Bahan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">
          <FlaskConical className="text-cyan-600" />
        </div>
        <div>
          <p className="text-slate-500">Total Pencatatan</p>
          <h2 className="text-2xl font-bold">{filtered.length}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-md mb-5">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari bahan atau outlet..."
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
              <th className="p-4 text-left">Bahan</th>
              <th className="p-4 text-left">Jumlah</th>
              <th className="p-4 text-left">Keterangan</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">
                <td className="p-4">{item.tanggal}</td>
                <td className="p-4 font-medium">{item.outlet}</td>
                <td className="p-4">{item.bahan}</td>
                <td className="p-4">
                  {item.jumlah} {item.satuan}
                </td>
                <td className="p-4">{item.keterangan}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 rounded-lg bg-red-100 hover:bg-red-200">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
