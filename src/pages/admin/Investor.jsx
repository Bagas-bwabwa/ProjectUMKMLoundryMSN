import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";

export default function InvestorPage() {

  const [search, setSearch] = useState("");

  const investors = [
    {
      id: 1,
      nama: "Budi Santoso",
      outlet: "Laundry Panam",
      modal: 20000000,
      persentase: 30,
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Andi Wijaya",
      outlet: "Laundry Arengka",
      modal: 15000000,
      persentase: 20,
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Rina Putri",
      outlet: "Laundry Marpoyan",
      modal: 25000000,
      persentase: 35,
      status: "Aktif",
    },
  ];

  const filteredInvestor = investors.filter((investor) =>
    investor.nama
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalModal = investors.reduce(
    (total, investor) => total + investor.modal,
    0
  );

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Data Investor
          </h1>

          <p className="text-slate-500">
            Kelola investor seluruh outlet laundry
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
          Tambah Investor
        </button>

      </div>

      {/* CARD SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-5
          "
        >
          <p className="text-slate-500">
            Total Investor
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {investors.length}
          </h2>
        </div>

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-5
          "
        >
          <p className="text-slate-500">
            Total Modal
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Rp {totalModal.toLocaleString("id-ID")}
          </h2>
        </div>

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-5
          "
        >
          <p className="text-slate-500">
            Outlet Didanai
          </p>

          <h2 className="text-3xl font-bold mt-2">
            3 Outlet
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
            placeholder="Cari investor..."
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
                Nama Investor
              </th>

              <th className="p-4 text-left">
                Outlet
              </th>

              <th className="p-4 text-left">
                Modal
              </th>

              <th className="p-4 text-left">
                Persentase
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

            {filteredInvestor.map((investor) => (

              <tr
                key={investor.id}
                className="
                border-t
                hover:bg-slate-50
                "
              >

                <td className="p-4">
                  {investor.id}
                </td>

                <td className="p-4 font-medium">
                  {investor.nama}
                </td>

                <td className="p-4">
                  {investor.outlet}
                </td>

                <td className="p-4">
                  Rp {investor.modal.toLocaleString("id-ID")}
                </td>

                <td className="p-4">
                  {investor.persentase}%
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
                    {investor.status}
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