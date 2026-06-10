import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function TransactionsPage() {
  const [dailyTransactions, setDailyTransactions] = useState([]);

  useEffect(() => {
  axios
    .get("http://localhost:3000/transactions")
    .then((response) => {

      const grouped = response.data.reduce(
        (acc, transaction) => {

          const existing = acc.find(
            (item) =>
              item.date === transaction.date
          );

          if (existing) {

            existing.totalIncome +=
              transaction.total;

            existing.totalTransactions += 1;

            if (
              transaction.status === "Selesai"
            ) {
              existing.completed += 1;
            } else {
              existing.processing += 1;
            }

          } else {

            acc.push({
              date: transaction.date,
              totalIncome: transaction.total,
              totalTransactions: 1,
              completed:
                transaction.status === "Selesai"
                  ? 1
                  : 0,
              processing:
                transaction.status === "Diproses"
                  ? 1
                  : 0,
            });

          }

          return acc;

        },
        []
      );

      grouped.sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

      setDailyTransactions(grouped);

    })
    .catch((error) => {
      console.error(
        "Gagal mengambil data:",
        error
      );
    });
}, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="text-gray-500">
          Ringkasan pendapatan harian
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {dailyTransactions.map((item) => (
          <Link
            key={item.date}
            to={`/transactions/${item.date}`}
          >
            <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition cursor-pointer border">

              <h2 className="text-lg font-semibold mb-4">
                {item.date}
              </h2>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">
                  Total Pendapatan
                </p>

                <h3 className="text-2xl font-bold text-emerald-600">
                  Rp{" "}
                  {item.totalIncome.toLocaleString(
                    "id-ID"
                  )}
                </h3>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  Total Transaksi:
                  <span className="font-semibold ml-2">
                    {item.totalTransactions}
                  </span>
                </p>

                <p>
                  Selesai:
                  <span className="text-green-600 font-semibold ml-2">
                    {item.completed}
                  </span>
                </p>

                <p>
                  Diproses:
                  <span className="text-yellow-600 font-semibold ml-2">
                    {item.processing}
                  </span>
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}