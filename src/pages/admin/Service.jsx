import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function ServicePage() {

  const [search, setSearch] = useState("");

  const services = [
    {
      id: 1,
      nama: "Cuci Kering",
      harga: 7000,
      estimasi: "1 Hari",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Cuci Setrika",
      harga: 9000,
      estimasi: "2 Hari",
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Setrika Saja",
      harga: 5000,
      estimasi: "1 Hari",
      status: "Aktif",
    },
    {
      id: 4,
      nama: "Express",
      harga: 15000,
      estimasi: "6 Jam",
      status: "Aktif",
    },
  ];

  const filteredServices = services.filter((service) =>
    service.nama
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Layanan Laundry
          </h1>

          <p className="text-slate-500">
            Kelola seluruh layanan laundry
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
          Tambah Layanan
        </button>

      </div>

      {/* SUMMARY CARD */}

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
          <Sparkles className="text-cyan-600" />
        </div>

        <div>

          <p className="text-slate-500">
            Total Layanan
          </p>

          <h2 className="text-2xl font-bold">
            {services.length}
          </h2>

        </div>

      </div>

      {/* SEARCH */}

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
            placeholder="Cari layanan..."
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

      {/* TABLE */}

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
                Nama Layanan
              </th>

              <th className="p-4 text-left">
                Harga / Kg
              </th>

              <th className="p-4 text-left">
                Estimasi
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

            {filteredServices.map((service) => (

              <tr
                key={service.id}
                className="
                border-t
                hover:bg-slate-50
                "
              >

                <td className="p-4">
                  {service.id}
                </td>

                <td className="p-4 font-medium">
                  {service.nama}
                </td>

                <td className="p-4">
                  Rp {service.harga.toLocaleString("id-ID")}
                </td>

                <td className="p-4">
                  {service.estimasi}
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
                    {service.status}
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

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}