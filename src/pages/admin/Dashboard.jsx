import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {

  const stats = [
    {
      title: "Total Outlet",
      value: "5",
      icon: Building2,
    },
    {
      title: "Total Karyawan",
      value: "27",
      icon: Users,
    },
    {
      title: "Investor Aktif",
      value: "8",
      icon: Wallet,
    },
    {
      title: "Omset Bulan Ini",
      value: "Rp 35.000.000",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500">
          Ringkasan seluruh aktivitas laundry
        </p>

      </div>

      {/* Statistik */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}
              className="
              bg-white
              rounded-2xl
              shadow-md
              p-5
              flex
              justify-between
              items-center
              "
            >

              <div>

                <p className="text-slate-500">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {item.value}
                </h2>

              </div>

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
                <Icon
                  size={28}
                  className="text-cyan-600"
                />
              </div>

            </div>

          );

        })}

      </div>

      {/* Chart Section */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-6
          "
        >

          <h3 className="font-semibold text-lg mb-4">
            Pendapatan Bulanan
          </h3>

          <div
            className="
            h-72
            bg-slate-100
            rounded-xl
            flex
            items-center
            justify-center
            text-slate-400
            "
          >
            Grafik Pendapatan
          </div>

        </div>

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-6
          "
        >

          <h3 className="font-semibold text-lg mb-4">
            Pengeluaran Bulanan
          </h3>

          <div
            className="
            h-72
            bg-slate-100
            rounded-xl
            flex
            items-center
            justify-center
            text-slate-400
            "
          >
            Grafik Pengeluaran
          </div>

        </div>

      </div>

      {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-6
          "
        >

          <h3 className="font-semibold text-lg mb-4">
            Top Outlet
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Laundry Panam</span>
              <span className="font-semibold">
                Rp 12.500.000
              </span>
            </div>

            <div className="flex justify-between">
              <span>Laundry Arengka</span>
              <span className="font-semibold">
                Rp 9.800.000
              </span>
            </div>

            <div className="flex justify-between">
              <span>Laundry Marpoyan</span>
              <span className="font-semibold">
                Rp 7.300.000
              </span>
            </div>

          </div>

        </div>

        <div
          className="
          bg-white
          rounded-2xl
          shadow-md
          p-6
          "
        >

          <h3 className="font-semibold text-lg mb-4">
            Investor Aktif
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Budi Santoso</span>
              <span>30%</span>
            </div>

            <div className="flex justify-between">
              <span>Andi Wijaya</span>
              <span>25%</span>
            </div>

            <div className="flex justify-between">
              <span>Rina Putri</span>
              <span>20%</span>
            </div>

          </div>

        </div>

      </div>

      {/* Transaksi Terbaru */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
        "
      >

        <h3 className="font-semibold text-lg mb-4">
          Transaksi Terbaru
        </h3>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Invoice
              </th>

              <th className="text-left py-3">
                Pelanggan
              </th>

              <th className="text-left py-3">
                Outlet
              </th>

              <th className="text-left py-3">
                Total
              </th>

              <th className="text-left py-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-b">

              <td className="py-3">
                INV001
              </td>

              <td>
                Ahmad
              </td>

              <td>
                Laundry Panam
              </td>

              <td>
                Rp 85.000
              </td>

              <td>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                  Selesai
                </span>
              </td>

            </tr>

            <tr>

              <td className="py-3">
                INV002
              </td>

              <td>
                Siti
              </td>

              <td>
                Laundry Arengka
              </td>

              <td>
                Rp 55.000
              </td>

              <td>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm">
                  Diproses
                </span>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}