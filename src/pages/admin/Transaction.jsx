import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Printer,
} from "lucide-react";

export default function TransactionPage() {

  const [search, setSearch] = useState("");

  const transactions = [
    {
      id: 1,
      invoice: "INV-001",
      customer: "Ahmad",
      outlet: "Laundry Panam",
      service: "Cuci Setrika",
      weight: "5 Kg",
      total: 45000,
      status: "Diproses",
    },
    {
      id: 2,
      invoice: "INV-002",
      customer: "Budi",
      outlet: "Laundry Arengka",
      service: "Express",
      weight: "3 Kg",
      total: 45000,
      status: "Selesai",
    },
    {
      id: 3,
      invoice: "INV-003",
      customer: "Siti",
      outlet: "Laundry Marpoyan",
      service: "Cuci Kering",
      weight: "7 Kg",
      total: 56000,
      status: "Menunggu",
    },
  ];

  const filteredData = transactions.filter((item) =>
    item.customer
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function getStatusColor(status) {

    switch (status) {

      case "Selesai":
        return "bg-green-100 text-green-700";

      case "Diproses":
        return "bg-blue-100 text-blue-700";

      case "Menunggu":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";

    }

  }

  return (

    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Transaksi Laundry
          </h1>

          <p className="text-slate-500">
            Kelola seluruh transaksi laundry
          </p>

        </div>

        <Link
  to="/transactions/create"
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
  Transaksi Baru
</Link>

      </div>

      {/* Statistik */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">
            Total Transaksi
          </p>
          <h2 className="text-3xl font-bold">
            125
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">
            Sedang Diproses
          </p>
          <h2 className="text-3xl font-bold text-blue-600">
            18
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">
            Selesai Hari Ini
          </p>
          <h2 className="text-3xl font-bold text-green-600">
            32
          </h2>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white p-4 rounded-2xl shadow-md mb-5">

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
            placeholder="Cari pelanggan..."
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
                Invoice
              </th>

              <th className="p-4 text-left">
                Pelanggan
              </th>

              <th className="p-4 text-left">
                Outlet
              </th>

              <th className="p-4 text-left">
                Layanan
              </th>

              <th className="p-4 text-left">
                Berat
              </th>

              <th className="p-4 text-left">
                Total
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

            {filteredData.map((item) => (

              <tr
                key={item.id}
                className="
                border-t
                hover:bg-slate-50
                "
              >

                <td className="p-4 font-medium">
                  {item.invoice}
                </td>

                <td className="p-4">
                  {item.customer}
                </td>

                <td className="p-4">
                  {item.outlet}
                </td>

                <td className="p-4">
                  {item.service}
                </td>

                <td className="p-4">
                  {item.weight}
                </td>

                <td className="p-4">
                  Rp {item.total.toLocaleString("id-ID")}
                </td>

                <td className="p-4">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      ${getStatusColor(item.status)}
                    `}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <Link
  to={`/transactions/${item.id}`}
  className="
  p-2
  rounded-lg
  bg-cyan-100
  hover:bg-cyan-200
  "
>
  <Eye size={18}/>
</Link>

                    <button
                      className="
                      p-2
                      rounded-lg
                      bg-green-100
                      hover:bg-green-200
                      "
                    >
                      <Printer size={18}/>
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