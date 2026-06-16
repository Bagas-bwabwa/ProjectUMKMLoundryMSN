import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, Printer, Save } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useLocalData, getLocalData } from "@/hooks/useLocalData";
import { transactions as initialTx, formatRupiah } from "@/data/laundryData";
import { CRUD_CONFIGS } from "@/data/pageConfigs";
import { getCurrentUser } from "@/services/authService";
import { ROUTES } from "@/router/paths";

function getStatusColor(status) {
  switch (status) {
    case "Selesai":
      return "bg-green-100 text-green-700";
    case "Diproses":
      return "bg-blue-100 text-blue-700";
    case "Menunggu":
      return "bg-yellow-100 text-yellow-700";
    case "Dibatalkan":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function TransactionPage() {
  const user = getCurrentUser();
  const { data, add } = useLocalData("transactions", initialTx);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    outlet: user?.outlet ?? "Laundry Panam",
    service: "Cuci Setrika",
    weight: "",
    finishDate: "",
    total: "",
    paymentStatus: "Belum Bayar",
  });

  const outlets = getLocalData(
    CRUD_CONFIGS.outlets.storageKey,
    CRUD_CONFIGS.outlets.initialData
  );
  const services = getLocalData(
    CRUD_CONFIGS.services.storageKey,
    CRUD_CONFIGS.services.initialData
  );

  const filtered = useMemo(() => {
    let list = data;
    if (user?.role === "kasir") {
      list = list.filter((t) => t.outlet === user.outlet);
    }
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (t) =>
        t.customer.toLowerCase().includes(q) ||
        t.invoice.toLowerCase().includes(q)
    );
  }, [data, search, user]);

  const stats = useMemo(() => {
    const active = filtered.filter((t) => !t.cancelled);
    return {
      total: active.length,
      diproses: active.filter((t) => t.status === "Diproses").length,
      selesai: active.filter((t) => t.status === "Selesai").length,
    };
  }, [filtered]);

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "service" || field === "weight") {
        const svc = services.find((s) => s.nama === next.service);
        const weight = Number(next.weight) || 0;
        if (svc && weight > 0) next.total = String(svc.harga * weight);
      }
      return next;
    });
  }

  function openAdd() {
    setForm({
      customer: "",
      phone: "",
      outlet: user?.outlet ?? outlets[0]?.nama ?? "",
      service: services[1]?.nama ?? services[0]?.nama ?? "",
      weight: "",
      finishDate: "",
      total: "",
      paymentStatus: "Belum Bayar",
    });
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.customer.trim() || !form.weight) return;

    const nextId = data.length ? Math.max(...data.map((t) => t.id)) + 1 : 1;
    add({
      invoice: `INV-${String(nextId).padStart(3, "0")}`,
      customer: form.customer,
      phone: form.phone,
      outlet: form.outlet,
      service: form.service,
      weight: Number(form.weight),
      total: Number(form.total) || 0,
      status: "Menunggu",
      paymentStatus: form.paymentStatus,
      tanggal: new Date().toISOString().slice(0, 10),
      cancelled: false,
    });

    setToast("Transaksi berhasil disimpan");
    setTimeout(() => setToast(""), 2500);
    setModalOpen(false);
  }

  function handlePrint(item) {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Nota ${item.invoice}</title></head><body style="font-family:sans-serif;padding:24px">
      <h2>LaundryMSN — Nota</h2>
      <p><b>Invoice:</b> ${item.invoice}</p>
      <p><b>Pelanggan:</b> ${item.customer}</p>
      <p><b>Outlet:</b> ${item.outlet}</p>
      <p><b>Layanan:</b> ${item.service} (${item.weight} Kg)</p>
      <p><b>Total:</b> ${formatRupiah(item.total)}</p>
      <p><b>Status:</b> ${item.status}</p>
      <script>window.print();window.close();</script>
      </body></html>
    `);
    win.document.close();
  }

  const outletOptions =
    user?.role === "kasir"
      ? outlets.filter((o) => o.nama === user.outlet)
      : outlets;

  return (
    <div>
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Transaksi Laundry</h1>
          <p className="text-slate-500">Kelola seluruh transaksi laundry</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition"
        >
          <Plus size={18} />
          Transaksi Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">Total Transaksi</p>
          <h2 className="text-3xl font-bold">{stats.total}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">Sedang Diproses</p>
          <h2 className="text-3xl font-bold text-blue-600">{stats.diproses}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">Selesai</p>
          <h2 className="text-3xl font-bold text-green-600">{stats.selesai}</h2>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md mb-5">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pelanggan atau invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Pelanggan</th>
              <th className="p-4 text-left">Outlet</th>
              <th className="p-4 text-left">Layanan</th>
              <th className="p-4 text-left">Berat</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium">{item.invoice}</td>
                <td className="p-4">{item.customer}</td>
                <td className="p-4">{item.outlet}</td>
                <td className="p-4">{item.service}</td>
                <td className="p-4">{item.weight} Kg</td>
                <td className="p-4">{formatRupiah(item.total)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`${ROUTES.TRANSACTIONS}/${item.id}`}
                      className="p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handlePrint(item)}
                      className="p-2 rounded-lg bg-green-100 hover:bg-green-200"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title="Transaksi Baru" onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Nama Pelanggan *</label>
              <input
                required
                value={form.customer}
                onChange={(e) => updateField("customer", e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">No HP</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Outlet</label>
              <select
                value={form.outlet}
                onChange={(e) => updateField("outlet", e.target.value)}
                disabled={user?.role === "kasir"}
                className="w-full border rounded-xl px-4 py-3"
              >
                {outletOptions.map((o) => (
                  <option key={o.id} value={o.nama}>{o.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Layanan</label>
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
              <label className="block mb-1 font-medium">Berat (Kg) *</label>
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={form.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Estimasi Selesai</label>
              <input
                type="date"
                value={form.finishDate}
                onChange={(e) => updateField("finishDate", e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Total Harga</label>
              <input
                type="number"
                value={form.total}
                onChange={(e) => updateField("total", e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Status Pembayaran</label>
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg"
            >
              <Save size={18} />
              Simpan Transaksi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
