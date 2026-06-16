import { useState } from "react";
import { ArrowLeft, Printer, XCircle, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useLocalData } from "@/hooks/useLocalData";
import { transactions as initialTx, formatRupiah } from "@/data/laundryData";
import { getCurrentUser } from "@/services/authService";
import { getLayananLabel, getQtyLabel, normalizeTransaction, TX_STATUSES } from "@/utils/reportUtils";
import { ROUTES } from "@/router/paths";
import { api } from "@/services/apiClient";

function getPaymentStatusColor(status) {
  switch (status) {
    case "Lunas": return "bg-green-100 text-green-700";
    case "DP": return "bg-yellow-100 text-yellow-700";
    case "Belum Lunas": return "bg-red-100 text-red-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

export default function TransactionDetailPage() {
  const { id } = useParams();
  const user = getCurrentUser();
  const { data, update } = useLocalData("transactions", initialTx);
  const raw = data.find((t) => String(t.id) === String(id));
  const transaction = raw ? normalizeTransaction(raw) : null;
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [toast, setToast] = useState("");
  const statusFlow = ["Menunggu", "Diproses", "Selesai"];
  const PAYMENT_STATUSES = ["Belum Lunas", "DP", "Lunas"];

  if (!transaction) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Transaksi tidak ditemukan</p>
        <Link to={ROUTES.TRANSACTIONS} className="text-cyan-600 hover:underline">
          Kembali ke daftar transaksi
        </Link>
      </div>
    );
  }

  function handleStatusChange(newStatus) {
    if (newStatus === transaction.status || transaction.cancelled) return;
    if (user?.role === "kasir") {
      const currentIdx = statusFlow.indexOf(transaction.status);
      const nextStatus = statusFlow[currentIdx + 1];
      if (newStatus !== nextStatus) return;
    }
    const at = new Date().toISOString().slice(0, 10);
    const entry = {
      status: newStatus,
      by: user?.name ?? "Kasir",
      at,
      note: statusNote || `Status diubah ke ${newStatus}`,
    };
    update(transaction.id, {
      status: newStatus,
      finishDate: newStatus === "Selesai" ? at : transaction.finishDate,
      statusHistory: [...(transaction.statusHistory ?? []), entry],
    });
    api.transactions.update(transaction.id, { status: newStatus, finishDate: newStatus === "Selesai" ? at : transaction.finishDate })
      .catch(() => {});
    setStatusNote("");
    setToast(`Status diperbarui: ${newStatus}`);
    setTimeout(() => setToast(""), 2500);
  }

  function handlePaymentStatusChange(newStatus) {
    if (newStatus === transaction.paymentStatus || transaction.cancelled) return;
    const at = new Date().toISOString().slice(0, 10);
    const entry = {
      status: newStatus,
      by: user?.name ?? "Kasir",
      at,
      note: paymentNote || `Status pembayaran diubah ke ${newStatus}`,
    };
    const nextHistory = [...(transaction.paymentStatusHistory ?? []), entry];
    update(transaction.id, {
      paymentStatus: newStatus,
      paymentStatusHistory: nextHistory,
    });
    api.transactions.update(transaction.id, {
      paymentStatus: newStatus,
      paymentStatusHistory: nextHistory,
    }).catch(() => {});
    setPaymentNote("");
    setToast(`Status pembayaran: ${newStatus}`);
    setTimeout(() => setToast(""), 2500);
  }

  function handleCancel() {
    const at = new Date().toISOString().slice(0, 10);
    update(transaction.id, {
      status: "Dibatalkan",
      cancelled: true,
      paymentStatus: "Refund",
      paymentStatusHistory: [
        ...(transaction.paymentStatusHistory ?? []),
        { status: "Refund", by: user?.name ?? "Kasir", at, note: "Transaksi dibatalkan" },
      ],
      statusHistory: [
        ...(transaction.statusHistory ?? []),
        { status: "Dibatalkan", by: user?.name ?? "Kasir", at, note: "Transaksi dibatalkan" },
      ],
    });
    api.transactions.update(transaction.id, { status: "Dibatalkan", cancelled: true, paymentStatus: "Refund" })
      .catch(() => {});
    setShowCancelConfirm(false);
    setToast("Transaksi dibatalkan");
    setTimeout(() => setToast(""), 2500);
  }

  const canUpdateStatus = !transaction.cancelled && (user?.role === "kasir" || user?.role === "admin");
  const statusOptions = user?.role === "kasir"
    ? (() => {
      const currentIdx = statusFlow.indexOf(transaction.status);
      const nextStatus = statusFlow[currentIdx + 1];
      return nextStatus ? [nextStatus] : [];
    })()
    : TX_STATUSES;

  return (
    <div>
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Detail Transaksi</h1>
          <p className="text-slate-500">{transaction.invoice} — {transaction.customer}</p>
        </div>
        <div className="flex gap-3">
          <Link to={ROUTES.TRANSACTIONS}
            className="flex items-center gap-2 px-4 py-3 bg-slate-200 rounded-xl hover:bg-slate-300">
            <ArrowLeft size={18} /> Kembali
          </Link>
          {!transaction.cancelled && (
            <button type="button" onClick={() => setShowCancelConfirm(true)}
              className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600">
              <XCircle size={18} /> Batalkan
            </button>
          )}
          <button type="button" onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600">
            <Printer size={18} /> Cetak Nota
          </button>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-red-800 text-sm">Yakin batalkan transaksi?</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowCancelConfirm(false)}
              className="px-4 py-2 rounded-lg bg-white border text-sm">Batal</button>
            <button type="button" onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm">Ya, Batalkan</button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bold text-lg mb-3">Data Pelanggan</h2>
              <p><span className="text-slate-500">Nama:</span> {transaction.customer}</p>
              <p><span className="text-slate-500">No HP:</span> {transaction.phone || "—"}</p>
              <p><span className="text-slate-500">Kasir:</span> {transaction.kasir}</p>
            </div>
            <div>
              <h2 className="font-bold text-lg mb-3">Data Transaksi</h2>
              <p><span className="text-slate-500">Outlet:</span> {transaction.outlet}</p>
              <p><span className="text-slate-500">Jenis:</span> {transaction.layananType}</p>
              <p><span className="text-slate-500">Layanan:</span> {getLayananLabel(transaction)}</p>
              <p><span className="text-slate-500">
                {transaction.layananType === "Kiloan" ? "Berat:" : "Jumlah Item:"}
              </span> {getQtyLabel(transaction)}{transaction.layananType === "Kiloan" ? " Kg" : ""}</p>
              <p><span className="text-slate-500">Tanggal:</span> {transaction.tanggal}</p>
            </div>
          </div>

          {transaction.layananType === "Satuan" && transaction.lineItems?.length > 0 && (
            <div>
              <h2 className="font-bold text-lg mb-3">Detail Item Satuan</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-left py-2">Qty</th>
                  <th className="text-left py-2">Harga</th>
                  <th className="text-left py-2">Subtotal</th>
                </tr></thead>
                <tbody>
                  {transaction.lineItems.map((line, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{line.nama}</td>
                      <td>{line.qty}</td>
                      <td>{formatRupiah(line.harga)}</td>
                      <td className="font-semibold">{formatRupiah(line.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 text-right border-t pt-4">
            <div className="md:col-span-2 grid grid-cols-3 gap-4 text-left">
              <div><p className="text-slate-500 text-sm">Subtotal</p><p className="font-semibold">{formatRupiah(transaction.subtotal)}</p></div>
              <div><p className="text-slate-500 text-sm">Diskon</p><p className="font-semibold text-red-600">{formatRupiah(transaction.diskon)}</p></div>
              <div><p className="text-slate-500 text-sm">Total</p><p className="text-2xl font-bold text-cyan-600">{formatRupiah(transaction.total)}</p></div>
            </div>
            <div><p className="text-slate-500 text-sm">Metode Bayar</p><p>{transaction.metodePembayaran}</p></div>
            <div><p className="text-slate-500 text-sm">Status Bayar</p>
              <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(transaction.paymentStatus)}`}>{transaction.paymentStatus}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {canUpdateStatus && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-lg mb-4">Update Status</h2>
              <p className="text-sm text-slate-500 mb-3">
                Status saat ini: <strong>{transaction.status}</strong>
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {statusOptions.map((s) => (
                  <button key={s} type="button" onClick={() => handleStatusChange(s)}
                    disabled={s === transaction.status}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      s === transaction.status
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 hover:bg-cyan-100 text-slate-700"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Catatan perubahan (opsional)"
                value={statusNote} onChange={(e) => setStatusNote(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
          )}

          {canUpdateStatus && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-lg mb-4">Update Status Pembayaran</h2>
              <p className="text-sm text-slate-500 mb-3">
                Status bayar saat ini: <strong>{transaction.paymentStatus}</strong>
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {PAYMENT_STATUSES.map((s) => (
                  <button key={s} type="button" onClick={() => handlePaymentStatusChange(s)}
                    disabled={s === transaction.paymentStatus}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      s === transaction.paymentStatus
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 hover:bg-cyan-100 text-slate-700"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Catatan pembayaran (opsional)"
                value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock size={18} /> Riwayat Status
            </h2>
            <div className="space-y-4">
              {(transaction.statusHistory ?? []).slice().reverse().map((entry, i) => (
                <div key={i} className="border-l-4 border-cyan-400 pl-4">
                  <p className="font-semibold text-sm">{entry.status}</p>
                  <p className="text-xs text-slate-500">{entry.at} — {entry.by}</p>
                  {entry.note && <p className="text-xs text-slate-600 mt-1">{entry.note}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock size={18} /> Riwayat Status Pembayaran
            </h2>
            <div className="space-y-4">
              {(transaction.paymentStatusHistory ?? []).slice().reverse().map((entry, i) => (
                <div key={i} className="border-l-4 border-emerald-400 pl-4">
                  <p className="font-semibold text-sm">{entry.status}</p>
                  <p className="text-xs text-slate-500">{entry.at} — {entry.by}</p>
                  {entry.note && <p className="text-xs text-slate-600 mt-1">{entry.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
