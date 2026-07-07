import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, Printer, Save, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useLocalData, getLocalData } from "@/hooks/useLocalData";
import { transactions as initialTx, formatRupiah } from "@/data/laundryData";
import { CRUD_CONFIGS } from "@/data/pageConfigs";
import { getCurrentUser } from "@/services/authService";
import { getLayananLabel, normalizeTransaction } from "@/utils/reportUtils";
import { ROUTES } from "@/router/paths";
import {
  createTransactionOnApi,
  fetchTransactionsFromApi,
  hasApiSession,
} from "@/services/transactionService";

function getStatusColor(status) {
  switch (status) {
    case "Selesai": return "bg-green-100 text-green-700";
    case "Diproses": return "bg-blue-100 text-blue-700";
    case "Menunggu": return "bg-yellow-100 text-yellow-700";
    case "Dibatalkan": return "bg-red-100 text-red-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

const EMPTY_LINE = { itemId: "", qty: 1 };

function calcTotal(form, services, itemList) {
  let subtotal = 0;
  if (form.layananType === "Kiloan") {
    const svc = services.find((s) => s.nama === form.service);
    subtotal = (svc?.harga ?? 0) * (Number(form.weight) || 0);
  } else {
    subtotal = form.lineItems.reduce((sum, line) => {
      const item = itemList.find((i) => String(i.id) === String(line.itemId));
      const qty = Number(line.qty) || 0;
      return sum + (item?.harga ?? 0) * qty;
    }, 0);
  }
  const diskon = Number(form.diskon) || 0;
  return { subtotal, total: Math.max(0, subtotal - diskon) };
}

export default function TransactionPage() {
  const user = getCurrentUser();
  const { data, setData, add } = useLocalData("transactions", initialTx);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    customer: "", phone: "", outlet: user?.outlet ?? "Laundry Panam",
    layananType: "Kiloan", service: "Cuci Setrika", weight: "",
    lineItems: [{ ...EMPTY_LINE }], diskon: 0, finishDate: "",
    paymentStatus: "Belum Lunas", metodePembayaran: "Tunai",
  });

  const outlets = getLocalData(CRUD_CONFIGS.outlets.storageKey, CRUD_CONFIGS.outlets.initialData);
  const services = getLocalData(CRUD_CONFIGS.services.storageKey, CRUD_CONFIGS.services.initialData);
  const itemList = getLocalData(CRUD_CONFIGS.items.storageKey, CRUD_CONFIGS.items.initialData);

  const filtered = useMemo(() => {
    let list = data.map(normalizeTransaction);
    if (user?.role === "kasir") list = list.filter((t) => t.outlet === user.outlet);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((t) =>
      t.customer.toLowerCase().includes(q) || t.invoice.toLowerCase().includes(q)
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

  const { subtotal, total } = calcTotal(form, services, itemList);

  useEffect(() => {
    let mounted = true;
    async function syncFromApi() {
      if (!hasApiSession()) return;
      try {
        const mapped = await fetchTransactionsFromApi();
        if (mounted && mapped.length) setData(mapped);
      } catch {
        // fallback: tetap pakai local data
      }
    }
    syncFromApi();
    return () => {
      mounted = false;
    };
  }, [setData]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateLineItem(idx, field, value) {
    setForm((prev) => {
      const lineItems = prev.lineItems.map((l, i) =>
        i === idx ? { ...l, [field]: value } : l
      );
      return { ...prev, lineItems };
    });
  }

  function addLineItem() {
    setForm((prev) => ({ ...prev, lineItems: [...prev.lineItems, { ...EMPTY_LINE }] }));
  }

  function removeLineItem(idx) {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.length > 1 ? prev.lineItems.filter((_, i) => i !== idx) : prev.lineItems,
    }));
  }

  function openAdd() {
    setForm({
      customer: "", phone: "",
      outlet: user?.outlet ?? outlets[0]?.nama ?? "",
      layananType: "Kiloan",
      service: services[1]?.nama ?? services[0]?.nama ?? "",
      weight: "", lineItems: [{ ...EMPTY_LINE }],
      diskon: 0, finishDate: "",
      paymentStatus: "Belum Lunas", metodePembayaran: "Tunai",
    });
    setModalOpen(true);
  }

  function buildLineItems() {
    return form.lineItems
      .filter((l) => l.itemId)
      .map((line) => {
        const item = itemList.find((i) => String(i.id) === String(line.itemId));
        const qty = Number(line.qty) || 0;
        return {
          itemId: item?.id, nama: item?.nama ?? "", qty,
          harga: item?.harga ?? 0, subtotal: (item?.harga ?? 0) * qty,
        };
      });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.customer.trim()) return;
    if (form.layananType === "Kiloan" && !form.weight) return;
    if (form.layananType === "Satuan" && buildLineItems().length === 0) return;

    const tanggal = new Date().toISOString().slice(0, 10);
    const nextId = data.length ? Math.max(...data.map((t) => t.id)) + 1 : 1;
    const lineItems = form.layananType === "Satuan" ? buildLineItems() : [];
    const { subtotal: sub, total: tot } = calcTotal(form, services, itemList);

    const draftTx = {
      invoice: `INV-${String(nextId).padStart(3, "0")}`,
      customer: form.customer,
      phone: form.phone,
      outlet: form.outlet,
      layananType: form.layananType,
      service: form.layananType === "Kiloan" ? form.service : "",
      weight: form.layananType === "Kiloan" ? Number(form.weight) : 0,
      lineItems,
      subtotal: sub,
      diskon: Number(form.diskon) || 0,
      total: tot,
      metodePembayaran: form.metodePembayaran,
      status: "Menunggu",
      paymentStatus: form.paymentStatus,
      paymentStatusHistory: [{
        status: form.paymentStatus,
        by: user?.name ?? "Kasir",
        at: tanggal,
        note: "Status pembayaran awal",
      }],
      tanggal,
      finishDate: form.finishDate || null,
      cancelled: false,
      kasir: user?.name ?? "Kasir",
      kasirId: user?.kasirId ?? null,
      statusHistory: [{
        status: "Menunggu", by: user?.name ?? "Kasir", at: tanggal, note: "Transaksi dibuat",
      }],
    };

    add(draftTx);

    if (hasApiSession()) {
      try {
        const created = await createTransactionOnApi(form, {
          subtotal: sub,
          total: tot,
          lineItems,
          tanggal,
          user,
        });
        if (created?.apiId || created?.id) {
          setData((prev) => prev.map((tx) => (
            tx.invoice === draftTx.invoice
              ? { ...tx, apiId: created.apiId ?? created.id }
              : tx
          )));
          setToast("Transaksi berhasil disimpan (Tersinkron ke Database)");
        }
      } catch (error) {
        console.error("API Error:", error);
        setToast("Peringatan: Gagal menyimpan ke Database, hanya tersimpan di memori browser!");
      }
    } else {
      setToast("Transaksi berhasil disimpan (Hanya di browser)");
    }

    setTimeout(() => setToast(""), 4000);
    setModalOpen(false);
  }

  function handlePrint(item) {
    const tx = normalizeTransaction(item);
    const layanan = getLayananLabel(tx);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Nota ${tx.invoice}</title></head>
      <body style="font-family:sans-serif;padding:24px">
      <h2>LaundryMSN — Nota</h2>
      <p><b>Invoice:</b> ${tx.invoice}</p>
      <p><b>Pelanggan:</b> ${tx.customer}</p>
      <p><b>Outlet:</b> ${tx.outlet}</p>
      <p><b>Layanan:</b> ${layanan}</p>
      <p><b>Subtotal:</b> ${formatRupiah(tx.subtotal)}</p>
      <p><b>Diskon:</b> ${formatRupiah(tx.diskon)}</p>
      <p><b>Total:</b> ${formatRupiah(tx.total)}</p>
      <p><b>Metode:</b> ${tx.metodePembayaran}</p>
      <p><b>Status:</b> ${tx.status}</p>
      <script>window.print();window.close();</script>
      </body></html>
    `);
    win.document.close();
  }

  const outletOptions = user?.role === "kasir"
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
          <p className="text-slate-500">Kelola transaksi kiloan & satuan</p>
        </div>
        <button type="button" onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition">
          <Plus size={18} /> Transaksi Baru
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
          <input type="text" placeholder="Cari pelanggan atau invoice..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Pelanggan</th>
              <th className="p-4 text-left">Outlet</th>
              <th className="p-4 text-left">Jenis</th>
              <th className="p-4 text-left">Layanan</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Status Bayar</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium">{item.invoice}</td>
                <td className="p-4">{item.customer}</td>
                <td className="p-4">{item.outlet}</td>
                <td className="p-4">{item.layananType}</td>
                <td className="p-4 text-sm">{getLayananLabel(item)}</td>
                <td className="p-4">{formatRupiah(item.total)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4">{item.paymentStatus}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link to={`${ROUTES.TRANSACTIONS}/${item.id}`}
                      className="p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200">
                      <Eye size={18} />
                    </Link>
                    <button type="button" onClick={() => handlePrint(item)}
                      className="p-2 rounded-lg bg-green-100 hover:bg-green-200">
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
          <div className="flex gap-3 mb-2">
            {["Kiloan", "Satuan"].map((type) => (
              <button key={type} type="button"
                onClick={() => updateField("layananType", type)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  form.layananType === type
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                Laundry {type}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Nama Pelanggan *</label>
              <input required value={form.customer}
                onChange={(e) => updateField("customer", e.target.value)}
                className="w-full border rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block mb-1 font-medium">No HP</label>
              <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)}
                className="w-full border rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Outlet</label>
              <select value={form.outlet} onChange={(e) => updateField("outlet", e.target.value)}
                disabled={user?.role === "kasir"} className="w-full border rounded-xl px-4 py-3">
                {outletOptions.map((o) => (
                  <option key={o.id} value={o.nama}>{o.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Estimasi Selesai</label>
              <input type="date" value={form.finishDate}
                onChange={(e) => updateField("finishDate", e.target.value)}
                className="w-full border rounded-xl px-4 py-3" />
            </div>
          </div>

          {form.layananType === "Kiloan" ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Layanan</label>
                <select value={form.service} onChange={(e) => updateField("service", e.target.value)}
                  className="w-full border rounded-xl px-4 py-3">
                  {services.filter((s) => s.status === "Aktif").map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama} — Rp {s.harga.toLocaleString("id-ID")}/kg
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Berat (Kg) *</label>
                <input type="number" required min="0.1" step="0.1" value={form.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className="w-full border rounded-xl px-4 py-3" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-medium">Item Satuan *</label>
                <button type="button" onClick={addLineItem}
                  className="text-sm text-cyan-600 hover:underline">+ Tambah Item</button>
              </div>
              {form.lineItems.map((line, idx) => {
                const item = itemList.find((i) => String(i.id) === String(line.itemId));
                const lineSub = (item?.harga ?? 0) * (Number(line.qty) || 0);
                return (
                  <div key={idx} className="flex gap-2 items-end bg-slate-50 p-3 rounded-xl">
                    <div className="flex-1">
                      <select value={line.itemId} onChange={(e) => updateLineItem(idx, "itemId", e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm">
                        <option value="">Pilih item...</option>
                        {itemList.filter((i) => i.status === "Aktif").map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.nama} — Rp {i.harga.toLocaleString("id-ID")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <input type="number" min="1" value={line.qty}
                        onChange={(e) => updateLineItem(idx, "qty", e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="w-28 text-sm font-semibold text-right">
                      {formatRupiah(lineSub)}
                    </div>
                    {form.lineItems.length > 1 && (
                      <button type="button" onClick={() => removeLineItem(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">Subtotal</label>
              <input readOnly value={formatRupiah(subtotal)}
                className="w-full border rounded-xl px-4 py-3 bg-slate-50" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Diskon (Rp)</label>
              <input type="number" min="0" value={form.diskon}
                onChange={(e) => updateField("diskon", e.target.value)}
                className="w-full border rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Total Bayar</label>
              <input readOnly value={formatRupiah(total)}
                className="w-full border rounded-xl px-4 py-3 bg-cyan-50 font-bold text-cyan-700" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Metode Pembayaran</label>
              <select value={form.metodePembayaran}
                onChange={(e) => updateField("metodePembayaran", e.target.value)}
                className="w-full border rounded-xl px-4 py-3">
                <option>Tunai</option><option>Transfer</option><option>QRIS</option><option>Debit</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Status Pembayaran</label>
              <select value={form.paymentStatus}
                onChange={(e) => updateField("paymentStatus", e.target.value)}
                className="w-full border rounded-xl px-4 py-3">
                <option>Belum Lunas</option><option>DP</option><option>Lunas</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg">
              <Save size={18} /> Simpan Transaksi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
