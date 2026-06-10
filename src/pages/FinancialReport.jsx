import { useState, useEffect } from "react";
import transactionsData from "@/data/transactions.json";

export default function FinancialReport() {
  const [searchName, setSearchName] = useState("");

  const [filteredTransactions, setFilteredTransactions] =
    useState(transactionsData);

  useEffect(() => {
    const filtered = transactionsData.filter((item) =>
      item.customer
        .toLowerCase()
        .includes(searchName.toLowerCase())
    );

    setFilteredTransactions(filtered);
  }, [searchName]);

  const totalRevenue = filteredTransactions.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const totalTransactions =
    filteredTransactions.length;

  const totalWeight = filteredTransactions.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  const averageRevenue =
    totalTransactions > 0
      ? Math.round(totalRevenue / totalTransactions)
      : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Laporan Keuangan Laundry
        </h1>

        <p className="text-gray-500">
          Ringkasan transaksi dan pendapatan
        </p>
      </div>

      {/* Pencarian */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <label className="block text-sm font-medium mb-2">
          Cari Nama Pelanggan
        </label>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Masukkan nama pelanggan..."
            value={searchName}
            onChange={(e) =>
              setSearchName(e.target.value)
            }
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => setSearchName("")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Total Pendapatan
          </h3>

          <p className="text-3xl font-bold text-green-600">
            Rp{" "}
            {totalRevenue.toLocaleString(
              "id-ID"
            )}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Total Transaksi
          </h3>

          <p className="text-3xl font-bold text-blue-600">
            {totalTransactions}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Total Berat
          </h3>

          <p className="text-3xl font-bold text-purple-600">
            {totalWeight} Kg
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Rata-rata Pendapatan
          </h3>

          <p className="text-3xl font-bold text-orange-500">
            Rp{" "}
            {averageRevenue.toLocaleString(
              "id-ID"
            )}
          </p>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">
                ID
              </th>
              <th className="p-4 text-left">
                Pelanggan
              </th>
              <th className="p-4 text-left">
                Layanan
              </th>
              <th className="p-4 text-left">
                Berat
              </th>
              <th className="p-4 text-left">
                Tanggal
              </th>
              <th className="p-4 text-left">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map(
              (transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    {transaction.id}
                  </td>

                  <td className="p-4">
                    {transaction.customer}
                  </td>

                  <td className="p-4">
                    {transaction.service}
                  </td>

                  <td className="p-4">
                    {transaction.weight} Kg
                  </td>

                  <td className="p-4">
                    {transaction.date}
                  </td>

                  <td className="p-4 font-semibold text-green-600">
                    Rp{" "}
                    {transaction.total.toLocaleString(
                      "id-ID"
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Data pelanggan tidak ditemukan
          </div>
        )}
      </div>
    </div>
  );
}