import { useState } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
import { outlets as outletData } from "@/data/laundryData";

export default function Outlet() {

  const [search, setSearch] = useState("");
  const outlets = outletData;

  const filteredOutlet = outlets.filter((outlet) =>
    outlet.nama
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Data Outlet
          </h1>

          <p className="text-slate-500">
            Kelola seluruh cabang laundry
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
          Tambah Outlet
        </button>

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
            placeholder="Cari outlet..."
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

          <thead
            className="
            bg-slate-100
            "
          >
            <tr>

              <th className="p-4 text-left">
                ID
              </th>

              <th className="p-4 text-left">
                Nama Outlet
              </th>

              <th className="p-4 text-left">
                Kota
              </th>

              <th className="p-4 text-left">
                Telepon
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

            {filteredOutlet.map((outlet) => (

              <tr
                key={outlet.id}
                className="
                border-t
                hover:bg-slate-50
                "
              >

                <td className="p-4">
                  {outlet.id}
                </td>

                <td className="p-4 font-medium">
                  {outlet.nama}
                </td>

                <td className="p-4">
                  {outlet.kota}
                </td>

                <td className="p-4">
                  {outlet.telepon}
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
                    {outlet.status}
                  </span>

                </td>

                <td
  className="
  p-4
  flex
  justify-center
  gap-3
  "
>

  <Link
    to={`/outlets/${outlet.id}`}
    className="
    p-2
    rounded-lg
    bg-cyan-100
    hover:bg-cyan-200
    "
  >
    <Eye size={18} />
  </Link>

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

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}