import {
  BarChart3,
  TrendingUp,
  Wallet,
  Receipt,
  Download,
} from "lucide-react";

export default function ReportPage() {

  const laporanOutlet = [
    {
      id: 1,
      outlet: "Laundry Panam",
      pendapatan: 12500000,
      pengeluaran: 3500000,
    },
    {
      id: 2,
      outlet: "Laundry Arengka",
      pendapatan: 9800000,
      pengeluaran: 2800000,
    },
    {
      id: 3,
      outlet: "Laundry Marpoyan",
      pendapatan: 11000000,
      pengeluaran: 3000000,
    },
  ];

  const totalPendapatan =
    laporanOutlet.reduce(
      (a, b) => a + b.pendapatan,
      0
    );

  const totalPengeluaran =
    laporanOutlet.reduce(
      (a, b) => a + b.pengeluaran,
      0
    );

  const labaBersih =
    totalPendapatan -
    totalPengeluaran;

  return (

    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Laporan Keuangan
          </h1>

          <p className="text-slate-500">
            Ringkasan seluruh aktivitas bisnis laundry
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
          <Download size={18}/>
          Export PDF
        </button>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white p-5 rounded-2xl shadow-md">

          <div className="flex justify-between">

            <div>

              <p className="text-slate-500">
                Pendapatan
              </p>

              <h2 className="text-2xl font-bold text-green-600">
                Rp {totalPendapatan.toLocaleString("id-ID")}
              </h2>

            </div>

            <TrendingUp className="text-green-500"/>

          </div>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">

          <div className="flex justify-between">

            <div>

              <p className="text-slate-500">
                Pengeluaran
              </p>

              <h2 className="text-2xl font-bold text-red-600">
                Rp {totalPengeluaran.toLocaleString("id-ID")}
              </h2>

            </div>

            <Wallet className="text-red-500"/>

          </div>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">

          <div className="flex justify-between">

            <div>

              <p className="text-slate-500">
                Laba Bersih
              </p>

              <h2 className="text-2xl font-bold text-cyan-600">
                Rp {labaBersih.toLocaleString("id-ID")}
              </h2>

            </div>

            <BarChart3 className="text-cyan-500"/>

          </div>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">

          <div className="flex justify-between">

            <div>

              <p className="text-slate-500">
                Total Transaksi
              </p>

              <h2 className="text-2xl font-bold">
                324
              </h2>

            </div>

            <Receipt className="text-blue-500"/>

          </div>

        </div>

      </div>

      {/* CHART PLACEHOLDER */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
        mb-8
        "
      >

        <h2 className="font-bold text-xl mb-4">
          Grafik Pendapatan Bulanan
        </h2>

        <div
          className="
          h-72
          rounded-xl
          border-2
          border-dashed
          border-slate-300
          flex
          items-center
          justify-center
          text-slate-400
          "
        >
          Grafik Recharts Akan Ditampilkan Disini
        </div>

      </div>

      {/* LAPORAN OUTLET */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
        mb-8
        "
      >

        <div className="p-5 border-b">

          <h2 className="font-bold text-xl">
            Laporan Per Outlet
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Outlet
              </th>

              <th className="p-4 text-left">
                Pendapatan
              </th>

              <th className="p-4 text-left">
                Pengeluaran
              </th>

              <th className="p-4 text-left">
                Laba Bersih
              </th>

            </tr>

          </thead>

          <tbody>

            {laporanOutlet.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-4 font-medium">
                  {item.outlet}
                </td>

                <td className="p-4 text-green-600 font-semibold">
                  Rp {item.pendapatan.toLocaleString("id-ID")}
                </td>

                <td className="p-4 text-red-600 font-semibold">
                  Rp {item.pengeluaran.toLocaleString("id-ID")}
                </td>

                <td className="p-4 text-cyan-600 font-bold">
                  Rp {(item.pendapatan - item.pengeluaran).toLocaleString("id-ID")}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* INVESTOR */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
        "
      >

        <div className="p-5 border-b">

          <h2 className="font-bold text-xl">
            Bagi Hasil Investor
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Investor
              </th>

              <th className="p-4 text-left">
                Saham
              </th>

              <th className="p-4 text-left">
                Hak Bagi Hasil
              </th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-t">

              <td className="p-4">
                Budi Santoso
              </td>

              <td className="p-4">
                20%
              </td>

              <td className="p-4 text-green-600 font-semibold">
                Rp 1.620.000
              </td>

            </tr>

            <tr className="border-t">

              <td className="p-4">
                Andi Saputra
              </td>

              <td className="p-4">
                15%
              </td>

              <td className="p-4 text-green-600 font-semibold">
                Rp 1.215.000
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );

}