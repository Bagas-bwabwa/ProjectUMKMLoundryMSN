import { Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreateTransactionPage() {

  return (

    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Tambah Transaksi
          </h1>

          <p className="text-slate-500">
            Input transaksi laundry baru
          </p>

        </div>

     <Link
  to="/transactions"
  className="
  flex
  items-center
  gap-2
  px-4
  py-3
  bg-slate-200
  rounded-xl
  hover:bg-slate-300
  transition
  "
>
  <ArrowLeft size={18}/>
  Kembali
</Link>

      </div>

      <div
        className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        "
      >

        <form className="space-y-6">

          {/* DATA PELANGGAN */}

          <div>

            <h2
              className="
              text-lg
              font-bold
              mb-4
              "
            >
              Data Pelanggan
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div>

                <label className="block mb-2 font-medium">
                  Nama Pelanggan
                </label>

                <input
                  type="text"
                  placeholder="Masukkan nama pelanggan"
                  className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  focus:ring-2
                  focus:ring-cyan-400
                  outline-none
                  "
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  No HP
                </label>

                <input
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  focus:ring-2
                  focus:ring-cyan-400
                  outline-none
                  "
                />

              </div>

            </div>

          </div>

          {/* DATA LAUNDRY */}

          <div>

            <h2
              className="
              text-lg
              font-bold
              mb-4
              "
            >
              Detail Laundry
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div>

                <label className="block mb-2 font-medium">
                  Outlet
                </label>

                <select
                  className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  "
                >
                  <option>
                    Laundry Panam
                  </option>

                  <option>
                    Laundry Arengka
                  </option>

                  <option>
                    Laundry Marpoyan
                  </option>
                </select>

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Layanan
                </label>

                <select
                  className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  "
                >
                  <option>
                    Cuci Setrika
                  </option>

                  <option>
                    Cuci Kering
                  </option>

                  <option>
                    Express
                  </option>
                </select>

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Berat (Kg)
                </label>

                <input
                  type="number"
                  placeholder="Masukkan berat"
                  className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  "
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Estimasi Selesai
                </label>

                <input
                  type="date"
                  className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  "
                />

              </div>

            </div>

          </div>

          {/* PEMBAYARAN */}

          <div>

            <h2
              className="
              text-lg
              font-bold
              mb-4
              "
            >
              Pembayaran
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div>

                <label className="block mb-2 font-medium">
                  Total Harga
                </label>

                <input
                  type="number"
                  placeholder="Rp"
                  className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  "
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Status Pembayaran
                </label>

                <select
                  className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  "
                >
                  <option>
                    Belum Bayar
                  </option>

                  <option>
                    DP
                  </option>

                  <option>
                    Lunas
                  </option>
                </select>

              </div>

            </div>

          </div>

          {/* BUTTON */}

          <div className="flex justify-end">

            <button
              type="submit"
              className="
              flex
              items-center
              gap-2
              bg-gradient-to-r
              from-cyan-500
              to-blue-500
              text-white
              px-6
              py-3
              rounded-xl
              shadow-lg
              hover:scale-105
              transition
              "
            >
              <Save size={18}/>
              Simpan Transaksi
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}