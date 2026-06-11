import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `${(value / 1000000).toFixed(0)}jt`,
      },
    },
  },
};

export function RevenueBarChart({ labels, pendapatan, pengeluaran }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Pendapatan",
        data: pendapatan,
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderRadius: 8,
      },
      {
        label: "Pengeluaran",
        data: pengeluaran,
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="h-72">
      <Bar data={data} options={chartOptions} />
    </div>
  );
}

export function RevenueLineChart({ labels, pendapatan }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Pendapatan",
        data: pendapatan,
        borderColor: "rgb(6, 182, 212)",
        backgroundColor: "rgba(6, 182, 212, 0.15)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="h-72">
      <Line data={data} options={chartOptions} />
    </div>
  );
}
