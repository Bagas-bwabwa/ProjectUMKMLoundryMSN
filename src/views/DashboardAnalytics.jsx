import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

import {
  Activity,
  Shirt,
  PackageCheck,
  DollarSign,
} from "lucide-react";

import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { CardTitle } from "@/components/ui/CardTitle.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const laundryData = {
  labels: [
    "Cuci",
    "Pengeringan",
    "Setrika",
    "Packing",
    "Selesai",
  ],

  datasets: [
    {
      label: "Proses Laundry",

      data: [
        42,
        35,
        28,
        20,
        18,
      ],

      backgroundColor: [
        "#3B82F6",
        "#06B6D4",
        "#8B5CF6",
        "#22C55E",
        "#F59E0B",
      ],

      borderRadius: 10,
    },
  ],
};

const chartOptions = {

  responsive: true,

  animation: {
    duration: 1800,
    easing: "easeOutQuart",
  },

  plugins: {

    legend: {
      display: false,
    },

  },

  scales: {

    y: {
      beginAtZero: true,
    },

  },

};

export function DashboardAnalytics() {

  return (

    <div
      className="
      min-h-screen
      space-y-6
      p-2
      "
    >

      {/* Header */}

      <div
        className="
        flex
        gap-4
        rounded-2xl
        bg-gradient-to-r
        from-blue-500
        to-cyan-500
        p-5
        text-white
        shadow-xl
        "
      >

        <Activity
          className="
          h-12
          w-12
          animate-pulse
          "
        />

        <div>

          <h2
            className="
            text-2xl
            font-bold
            "
          >

            Analytics Laundry

          </h2>

          <p
            className="
            text-blue-100
            "
          >

            Monitoring aktivitas operasional laundry

          </p>

        </div>

      </div>


      {/* Statistik */}

      <div
        className="
        grid
        gap-5
        lg:grid-cols-3
        "
      >

        <Card
          className="
          group
          bg-blue-500
          text-white
          hover:scale-105
          duration-300
          shadow-xl
          "
        >

          <CardContent
            className="
            p-6
            "
          >

            <Shirt
              className="
              h-8
              w-8
              mb-3
              group-hover:rotate-12
              duration-300
              "
            />

            <p>Total Cucian</p>

            <h2
              className="
              text-3xl
              font-bold
              "
            >

              143

            </h2>

          </CardContent>

        </Card>


        <Card
          className="
          group
          bg-green-500
          text-white
          hover:scale-105
          duration-300
          shadow-xl
          "
        >

          <CardContent className="p-6">

            <PackageCheck
              className="
              h-8
              w-8
              mb-3
              group-hover:rotate-12
              duration-300
              "
            />

            <p>Selesai Hari Ini</p>

            <h2
              className="
              text-3xl
              font-bold
              "
            >

              76

            </h2>

          </CardContent>

        </Card>


        <Card
          className="
          group
          bg-orange-500
          text-white
          hover:scale-105
          duration-300
          shadow-xl
          "
        >

          <CardContent className="p-6">

            <DollarSign
              className="
              h-8
              w-8
              mb-3
              group-hover:rotate-12
              duration-300
              "
            />

            <p>Pendapatan</p>

            <h2
              className="
              text-3xl
              font-bold
              "
            >

              Rp2.850.000

            </h2>

          </CardContent>

        </Card>

      </div>


      {/* Chart */}

      <Card
        className="
        bg-white/80
        backdrop-blur-md
        shadow-xl
        hover:shadow-2xl
        duration-300
        "
      >

        <CardHeader>

          <CardTitle>

            Statistik Proses Laundry

          </CardTitle>

        </CardHeader>

        <CardContent
          className="
          h-80
          "
        >

          <Bar
            data={laundryData}
            options={chartOptions}
          />

        </CardContent>

      </Card>


      {/* Ringkasan */}

      <Card
        className="
        bg-white/80
        shadow-xl
        backdrop-blur-md
        "
      >

        <CardHeader>

          <CardTitle>

            Ringkasan Hari Ini

          </CardTitle>

        </CardHeader>

        <CardContent
          className="
          space-y-4
          "
        >

          <div
            className="
            flex
            justify-between
            "
          >

            <span>Total Order</span>

            <b>95</b>

          </div>

          <div
            className="
            flex
            justify-between
            "
          >

            <span>Pesanan Selesai</span>

            <b>76</b>

          </div>

          <div
            className="
            flex
            justify-between
            "
          >

            <span>Rata-rata Waktu</span>

            <b>2 Hari</b>

          </div>

        </CardContent>

      </Card>

    </div>

  );

}