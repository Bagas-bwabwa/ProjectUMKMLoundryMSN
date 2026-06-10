import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";

export default function ExpensePage() {

  const [search, setSearch] = useState("");

  const expenses = [
    {
      id: 1,
      tanggal: "2026-06-10",
      kategori: "Pembelian Deterjen",
      outlet: "Laundry Panam",
      nominal: 500000,
      keterangan: "Stok deterjen bulanan",
    },
    {
      id: 2,
      tanggal: "2026-06-11",
      kategori: "Listrik",
      outlet: "Laundry Arengka",
      nominal: 1200000,
      keterangan: "Tagihan listrik",
    },
    {
      id: 3,
      tanggal: "2026-06-12",
      kategori: "Pewangi",
      outlet: "Laundry Panam",
      nominal: 300000,
      keterangan: "Pembelian pewangi",
    },
  ];

  const filteredData = expenses.filter(
    (item) =>
      item.kategori
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.outlet
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalPengeluaran = expenses.reduce(
    (total, item) => total + item.nominal,
    0
  );

  return (

    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Pengeluaran
          </h1>

          <p className="text-slate-500">
            Kelola seluruh biaya operasional laundry
          </p>

        </div>

        <button
          className="
          flex items-center gap-2
          bg-gradient-to-r
          from-cyan-500
          to-blue-500
          text-white
          px-4 py-3
          rounded-xl
          shadow-lg
          hover:scale-105
          transition
          "
        >
          <Plus size={18}/>
          Tambah Pengeluaran
        </button>

      </div>

      {/* Statistik */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <div
          className="
          bg-white
          p-5
          rounded-2xl
          shadow-md
          "
        >

          <p className="text-slate-500">
            Total Pengeluaran
          </p>

          <h2
            className="
            text-3xl
            font-bold
            text-red-600
            "
          >
            Rp{" "}
            {totalPengeluaran.toLocaleString(
              "id-ID"
            )}
          </h2>

        </div>

        <div
          className="
          bg-white
          p-5
          rounded-2xl
          shadow-md
          "
        >

          <p className="text-slate-500">
            Total Transaksi
          </p>

          <h2 className="text-3xl font-bold">
            {expenses.length}
          </h2>

        </div>

        <div
          className="
          bg-white
          p-5
          rounded-2xl
          shadow-md
          "
        >

          <p className="text-slate-500">
            Outlet Aktif
          </p>

          <h2 className="text-3xl font-bold">
            2
          </h2>

        </div>

      </div>

      {/* Search */}

      <div
        className="
        bg-white
        p-4
        rounded-2xl
        shadow-md
        mb-5
        "
      >

        <div className="relative">

          <Search
            size={18}
            className="
            absolute
            left-3
            top-3
            text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Cari kategori atau outlet..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
            w-full
            pl-10
            pr-4
            py-3
            border
            rounded-xl
            focus:ring-2
            focus:ring-cyan-400
            outline-none
            "
          />

        </div>

      </div>

      {/* Table */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
        "
      >

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Tanggal
              </th>

              <th className="p-4 text-left">
                Kategori
              </th>

              <th className="p-4 text-left">
                Outlet
              </th>

              <th className="p-4 text-left">
                Nominal
              </th>

              <th className="p-4 text-left">
                Keterangan
              </th>

              <th className="p-4 text-center">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredData.map((item) => (

              <tr
                key={item.id}
                className="
                border-t
                hover:bg-slate-50
                "
              >

                <td className="p-4">
                  {item.tanggal}
                </td>

                <td className="p-4 font-medium">
                  {item.kategori}
                </td>

                <td className="p-4">
                  {item.outlet}
                </td>

                <td
                  className="
                  p-4
                  text-red-600
                  font-semibold
                  "
                >
                  Rp{" "}
                  {item.nominal.toLocaleString(
                    "id-ID"
                  )}
                </td>

                <td className="p-4">
                  {item.keterangan}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button
                      className="
                      p-2
                      rounded-lg
                      bg-yellow-100
                      hover:bg-yellow-200
                      "
                    >
                      <Pencil size={18}/>
                    </button>

                    <button
                      className="
                      p-2
                      rounded-lg
                      bg-red-100
                      hover:bg-red-200
                      "
                    >
                      <Trash2 size={18}/>
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