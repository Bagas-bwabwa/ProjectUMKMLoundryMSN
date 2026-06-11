import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { outlets, services } from "@/data/laundryData";
import { getCurrentUser } from "@/services/authService";
import { ROUTES } from "@/router/paths";

export default function CreateTransactionPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const defaultOutlet = user?.role === "kasir" ? user.outlet : outlets[0].nama;

  const [form, setForm] = useState({
    customer: "",
    phone: "",
    outlet: defaultOutlet,
    service: services[1].nama,
    weight: "",
    finishDate: "",
    total: "",
    paymentStatus: "Belum Bayar",
  });

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "service" || field === "weight") {
        const svc = services.find((s) => s.nama === next.service);
        const weight = Number(next.weight) || 0;
        if (svc && weight > 0) {
          next.total = String(svc.harga * weight);
        }
      }
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.customer.trim() || !form.weight) return;
    navigate(ROUTES.TRANSACTIONS);
  }

  const outletOptions =
    user?.role === "kasir"
      ? outlets.filter((o) => o.nama === user.outlet)
      : outlets;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tambah Transaksi</h1>
          <p className="text-slate-500">Input transaksi laundry baru (pemasukan)</p>
        </div>
        <Link
          to={ROUTES.TRANSACTIONS}
          className="flex items-center gap-2 px-4 py-3 bg-slate-200 rounded-xl hover:bg-slate-300 transition"
        >
          <ArrowLeft size={18} />
          Kembali
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-lg font-bold mb-4">Data Pelanggan</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Nama Pelanggan</label>
                <input
                  type="text"
                  required
                  value={form.customer}
                  onChange={(e) => updateField("customer", e.target.value)}
                  placeholder="Masukkan nama pelanggan"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">No HP</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Detail Laundry</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Outlet</label>
                <select
                  value={form.outlet}
                  onChange={(e) => updateField("outlet", e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                  disabled={user?.role === "kasir"}
                >
                  {outletOptions.map((o) => (
                    <option key={o.id} value={o.nama}>
                      {o.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Layanan</label>
                <select
                  value={form.service}
                  onChange={(e) => updateField("service", e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama} — Rp {s.harga.toLocaleString("id-ID")}/kg
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Berat (Kg)</label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  placeholder="Masukkan berat"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Estimasi Selesai</label>
                <input
                  type="date"
                  value={form.finishDate}
                  onChange={(e) => updateField("finishDate", e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Pembayaran</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Total Harga</label>
                <input
                  type="number"
                  value={form.total}
                  onChange={(e) => updateField("total", e.target.value)}
                  placeholder="Otomatis dari layanan × berat"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Status Pembayaran</label>
                <select
                  value={form.paymentStatus}
                  onChange={(e) => updateField("paymentStatus", e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option>Belum Bayar</option>
                  <option>DP</option>
                  <option>Lunas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              <Save size={18} />
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
