import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

export default function EmployeePage() {

  const [search, setSearch] = useState("");

  const employees = [
    {
      id: 1,
      nama: "Andi Saputra",
      outlet: "Laundry Panam",
      jabatan: "Kasir",
      hp: "08123456789",
      gaji: 3500000,
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Budi Santoso",
      outlet: "Laundry Arengka",
      jabatan: "Operator",
      hp: "08129876543",
      gaji: 3000000,
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Citra Dewi",
      outlet: "Laundry Marpoyan",
      jabatan: "Supervisor",
      hp: "081377788899",
      gaji: 4500000,
      status: "Aktif",
    },
  ];

  const filteredEmployee = employees.filter((employee) =>
    employee.nama
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Data Karyawan
          </h1>

          <p className="text-slate-500">
            Kelola seluruh karyawan laundry
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
          Tambah Karyawan
        </button>

      </div>

      {/* CARD TOTAL */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-md
        p-5
        mb-5
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
          <UserRound className="text-cyan-600" />
        </div>

        <div>

          <p className="text-slate-500">
            Total Karyawan
          </p>

          <h2 className="text-2xl font-bold">
            {employees.length}
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
            placeholder="Cari karyawan..."
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

              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4 text-left">Outlet</th>
              <th className="p-4 text-left">Jabatan</th>
              <th className="p-4 text-left">No HP</th>
              <th className="p-4 text-left">Gaji</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Aksi</th>

            </tr>

          </thead>

          <tbody>

            {filteredEmployee.map((employee) => (

              <tr
                key={employee.id}
                className="
                border-t
                hover:bg-slate-50
                "
              >

                <td className="p-4">
                  {employee.id}
                </td>

                <td className="p-4 font-medium">
                  {employee.nama}
                </td>

                <td className="p-4">
                  {employee.outlet}
                </td>

                <td className="p-4">
                  {employee.jabatan}
                </td>

                <td className="p-4">
                  {employee.hp}
                </td>

                <td className="p-4">
                  Rp {employee.gaji.toLocaleString("id-ID")}
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
                    {employee.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-3">

                    <button
                      className="
                      p-2
                      bg-yellow-100
                      rounded-lg
                      hover:bg-yellow-200
                      "
                    >
                      <Pencil size={18}/>
                    </button>

                    <button
                      className="
                      p-2
                      bg-red-100
                      rounded-lg
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