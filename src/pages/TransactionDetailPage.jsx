import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionDetailPage() {
  const { date } = useParams();

  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  axios
    .get("http://localhost:3000/transactions")
    .then((response) => {
      if (response.status !== 200) {
        return;
      }

      const filtered =
        response.data.filter(
          (item) => item.date === date
        );

      setTransactions(filtered);
    })
    .catch((err) => {
      console.error(err.message);
    });
}, [date]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Detail Transaksi
      </h1>

      <p className="mb-4 text-gray-500">
        Tanggal: {date}
      </p>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">
                Customer
              </th>
              <th className="p-3 text-left">
                Service
              </th>
              <th className="p-3 text-left">
                Berat
              </th>
              <th className="p-3 text-left">
                Status
              </th>
              <th className="p-3 text-left">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="p-3">
                  {item.customer}
                </td>

                <td className="p-3">
                  {item.service}
                </td>

                <td className="p-3">
                  {item.weight} Kg
                </td>

                <td className="p-3">
                  {item.status}
                </td>

                <td className="p-3">
                  Rp{" "}
                  {item.total.toLocaleString(
                    "id-ID"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}