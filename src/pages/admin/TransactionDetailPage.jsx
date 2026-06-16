import { useState } from "react";
import { ArrowLeft, Printer, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useLocalData } from "@/hooks/useLocalData";
import { transactions as initialTx, formatRupiah } from "@/data/laundryData";
import { ROUTES } from "@/router/paths";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const { data, update } = useLocalData("transactions", initialTx);
  const transaction = data.find((t) => String(t.id) === String(id)) ?? data[0];
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [toast, setToast] = useState("");

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

  function handleCancel() {
    update(transaction.id, {
      status: "Dibatalkan",
      cancelled: true,
      paymentStatus: "Refund",
    });
    setShowCancelConfirm(false);
    setToast("Transaksi dibatalkan");
    setTimeout(() => setToast(""), 2500);
  }

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
          <p className="text-slate-500">Informasi lengkap transaksi laundry</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={ROUTES.TRANSACTIONS}
            className="flex items-center gap-2 px-4 py-3 bg-slate-200 rounded-xl hover:bg-slate-300"
          >
            <ArrowLeft size={18} />
            Kembali
          </Link>
          {!transaction.cancelled && (
            <button
              type="button"
              onClick={() => setShowCancelConfirm(true)}
              className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
            >
              <XCircle size={18} />
              Batalkan
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            <Printer size={18} />
            Cetak Nota
          </button>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-red-800 text-sm">
            Yakin batalkan transaksi? Laporan keuangan akan disesuaikan.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowCancelConfirm(false)}
              className="px-4 py-2 rounded-lg bg-white border text-sm"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
            >
              Ya, Batalkan
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 print:shadow-none">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold text-lg mb-4">Data Pelanggan</h2>
            <div className="space-y-3">
              <div>
                <span className="text-slate-500">Nama :</span>
                <p>{transaction.customer}</p>
              </div>
              <div>
                <span className="text-slate-500">No HP :</span>
                <p>{transaction.phone || "—"}</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-4">Data Transaksi</h2>
            <div className="space-y-3">
              <div>
                <span className="text-slate-500">Invoice :</span>
                <p>{transaction.invoice}</p>
              </div>
              <div>
                <span className="text-slate-500">Outlet :</span>
                <p>{transaction.outlet}</p>
              </div>
              <div>
                <span className="text-slate-500">Layanan :</span>
                <p>{transaction.service}</p>
              </div>
              <div>
                <span className="text-slate-500">Berat :</span>
                <p>{transaction.weight} Kg</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold text-lg mb-4">Status</h2>
            <div className="space-y-3">
              <div>
                <span className="text-slate-500">Status Proses :</span>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm ${
                    transaction.cancelled
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Status Pembayaran :</span>
                <span className="ml-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {transaction.paymentStatus}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-4">Tanggal</h2>
            <p>{transaction.tanggal}</p>
          </div>
        </div>

        <hr className="my-6" />

        <div className="text-right">
          <p className="text-slate-500">Total Pembayaran</p>
          <h2 className="text-4xl font-bold text-cyan-600">
            {formatRupiah(transaction.total)}
          </h2>
        </div>
      </div>
    </div>
  );
}
