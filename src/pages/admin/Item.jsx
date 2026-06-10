import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

export default function ItemPage() {

  const [search, setSearch] = useState("");

  const items = [
    {
      id: 1,
      nama: "Jas",
      harga: 25000,
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Selimut",
      harga: 20000,
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Boneka Kecil",
      harga: 15000,
      status: "Aktif",
    },
    {
      id: 4,
      nama: "Sepatu",
      harga: 30000,
      status: "Aktif",
    },
  ];

  const filteredItems = items.filter((item) =>
    item.nama
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Item Satuan
          </h1>

          <p className="text-slate-500">
            Kelola item laundry satuan
          </p>

        </div>

        <button
          className="
          flex
          items-center
          gap-2
          bg-gradient-to-r
          from-cyan-500
          to-blue-500
          text-white
          px-4
          py-3
          rounded-xl
          shadow-lg
          hover:scale-105
          transition
          "
        >
          <Plus size={18} />
          Tambah Item
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
          w-14
          h-14
          rounded-xl
          bg-cyan-100
          flex
          items-center
          justify-center
          "
        >
          <Package className="text-cyan-600" />
        </div>

        <div>

          <p className="text-slate-500">
            Total Item
          </p>

          <h2 className="text-2xl font-bold">
            {items.length}
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
            placeholder="Cari item..."
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
                Nama Item
              </th>

              <th className="p-4 text-left">
                Harga
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

            {filteredItems.map((item) => (

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
                  Rp {item.harga.toLocaleString("id-ID")}
                </td>

                <td className="p-4">

                  <span
                    className="
                    bg-green-100
                    text-green-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    "
                  >
                    {item.status}
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
                      <Pencil size={18} />
                    </button>

                    <button
                      className="
                      p-2
                      rounded-lg
                      bg-red-100
                      hover:bg-red-200
                      "
                    >
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