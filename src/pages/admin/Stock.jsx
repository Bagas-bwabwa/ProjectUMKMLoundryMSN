import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

export default function StockPage() {

  const [search, setSearch] = useState("");

  const stocks = [
    {
      id: 1,
      nama: "Deterjen Rinso",
      kategori: "Bahan Cuci",
      stok: 25,
      satuan: "Kg",
    },
    {
      id: 2,
      nama: "Pewangi Downy",
      kategori: "Pewangi",
      stok: 10,
      satuan: "Liter",
    },
    {
      id: 3,
      nama: "Plastik Laundry",
      kategori: "Kemasan",
      stok: 3,
      satuan: "Pack",
    },
    {
      id: 4,
      nama: "Hanger",
      kategori: "Peralatan",
      stok: 50,
      satuan: "Pcs",
    },
  ];

  const filteredStock = stocks.filter((item) =>
    item.nama
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getStatus = (stok) => {

    if (stok <= 5)
      return {
        label: "Menipis",
        color:
          "bg-red-100 text-red-700",
      };

    if (stok <= 15)
      return {
        label: "Sedang",
        color:
          "bg-yellow-100 text-yellow-700",
      };

    return {
      label: "Aman",
      color:
        "bg-green-100 text-green-700",
    };

  };

  return (
    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Stok Barang
          </h1>

          <p className="text-slate-500">
            Kelola stok kebutuhan laundry
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
          Tambah Barang
        </button>

      </div>

      {/* Summary */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-md
        p-5
        mb-6
        flex
        items-center
        gap-4
        "
      >

        <div
          className="
          w-14 h-14
          rounded-xl
          bg-cyan-100
          flex
          items-center
          justify-center
          "
        >
          <Package className="text-cyan-600"/>
        </div>

        <div>

          <p className="text-slate-500">
            Total Barang
          </p>

          <h2 className="text-2xl font-bold">
            {stocks.length}
          </h2>

        </div>

      </div>

      {/* Search */}

      <div
        className="
        bg-white
        rounded-2xl
        p-4
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
            placeholder="Cari barang..."
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
            outline-none
            focus:ring-2
            focus:ring-cyan-400
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
                ID
              </th>

              <th className="p-4 text-left">
                Nama Barang
              </th>

              <th className="p-4 text-left">
                Kategori
              </th>

              <th className="p-4 text-left">
                Stok
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-center">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredStock.map((item) => {

              const status =
                getStatus(item.stok);

              return (

                <tr
                  key={item.id}
                  className="
                  border-t
                  hover:bg-slate-50
                  "
                >

                  <td className="p-4">
                    {item.id}
                  </td>

                  <td className="p-4 font-medium">
                    {item.nama}
                  </td>

                  <td className="p-4">
                    {item.kategori}
                  </td>

                  <td className="p-4">
                    {item.stok} {item.satuan}
                  </td>

                  <td className="p-4">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        ${status.color}
                      `}
                    >
                      {status.label}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

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

              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}