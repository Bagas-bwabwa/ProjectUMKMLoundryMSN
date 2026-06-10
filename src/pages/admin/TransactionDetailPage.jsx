import { ArrowLeft, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function TransactionDetailPage() {

  const { id } = useParams();

  const transaction = {
    id,
    invoice: "INV-001",
    customer: "Ahmad",
    phone: "08123456789",
    outlet: "Laundry Panam",
    service: "Cuci Setrika",
    weight: "5 Kg",
    receiveDate: "10 Juni 2026",
    finishDate: "12 Juni 2026",
    paymentStatus: "Lunas",
    processStatus: "Diproses",
    total: 45000,
  };

  return (

    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Detail Transaksi
          </h1>

          <p className="text-slate-500">
            Informasi lengkap transaksi laundry
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            to="/transactions"
            className="
            flex items-center gap-2
            px-4 py-3
            bg-slate-200
            rounded-xl
            hover:bg-slate-300
            "
          >
            <ArrowLeft size={18} />
            Kembali
          </Link>

          <button
            onClick={() => window.print()}
            className="
            flex items-center gap-2
            px-4 py-3
            bg-green-500
            text-white
            rounded-xl
            hover:bg-green-600
            "
          >
            <Printer size={18} />
            Cetak Nota
          </button>

        </div>

      </div>

      {/* Card */}

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <h2 className="font-bold text-lg mb-4">
              Data Pelanggan
            </h2>

            <div className="space-y-3">

              <div>
                <span className="text-slate-500">
                  Nama :
                </span>
                <p>{transaction.customer}</p>
              </div>

              <div>
                <span className="text-slate-500">
                  No HP :
                </span>
                <p>{transaction.phone}</p>
              </div>

            </div>

          </div>

          <div>

            <h2 className="font-bold text-lg mb-4">
              Data Transaksi
            </h2>

            <div className="space-y-3">

              <div>
                <span className="text-slate-500">
                  Invoice :
                </span>
                <p>{transaction.invoice}</p>
              </div>

              <div>
                <span className="text-slate-500">
                  Outlet :
                </span>
                <p>{transaction.outlet}</p>
              </div>

              <div>
                <span className="text-slate-500">
                  Layanan :
                </span>
                <p>{transaction.service}</p>
              </div>

              <div>
                <span className="text-slate-500">
                  Berat :
                </span>
                <p>{transaction.weight}</p>
              </div>

            </div>

          </div>

        </div>

        <hr className="my-6" />

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <h2 className="font-bold text-lg mb-4">
              Status
            </h2>

            <div className="space-y-3">

              <div>
                <span className="text-slate-500">
                  Status Proses :
                </span>

                <span
                  className="
                  ml-2
                  bg-blue-100
                  text-blue-700
                  px-3
                  py-1
                  rounded-full
                  "
                >
                  {transaction.processStatus}
                </span>

              </div>

              <div>
                <span className="text-slate-500">
                  Status Pembayaran :
                </span>

                <span
                  className="
                  ml-2
                  bg-green-100
                  text-green-700
                  px-3
                  py-1
                  rounded-full
                  "
                >
                  {transaction.paymentStatus}
                </span>

              </div>

            </div>

          </div>

          <div>

            <h2 className="font-bold text-lg mb-4">
              Tanggal
            </h2>

            <div className="space-y-3">

              <div>
                <span className="text-slate-500">
                  Tanggal Masuk :
                </span>
                <p>{transaction.receiveDate}</p>
              </div>

              <div>
                <span className="text-slate-500">
                  Estimasi Selesai :
                </span>
                <p>{transaction.finishDate}</p>
              </div>

            </div>

          </div>

        </div>

        <hr className="my-6" />

        <div className="text-right">

          <p className="text-slate-500">
            Total Pembayaran
          </p>

          <h2 className="text-4xl font-bold text-cyan-600">
            Rp {transaction.total.toLocaleString("id-ID")}
          </h2>

        </div>

      </div>

    </div>

  );

}