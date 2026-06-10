import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import {
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Loader,
  AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { CardTitle } from "@/components/ui/CardTitle.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Materi Pertemuan 11:
 * - useEffect dengan dependencies state untuk fetch dashboard data
 * - Multiple state untuk berbagai data yang berbeda
 * - Loading dan error handling
 */
export function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 245,
    incomingOrders: 89,
    completedLaundry: 74,
    revenue: "Rp3.450.000",
    chartData: {
      labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      datasets: [
        {
          label: "Pesanan Laundry",
          data: [25, 30, 28, 35, 40, 45],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.15)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    activities: [
      "Bagas - Laundry 5 Kg",
      "Order #LDR001 selesai",
      "Pembayaran Rp75.000 berhasil",
    ],
    tasks: [
      "Antar laundry pelanggan",
      "Setrika pakaian",
      "Cek stok deterjen",
      "Ambil laundry pelanggan",
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState({});

  /**
   * useEffect untuk fetch dashboard data
   * Dependencies: [] = hanya run saat component mount
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulasi API delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Bisa diganti dengan actual API call:
        // const response = await fetch('/api/dashboard');
        // const data = await response.json();
        // setDashboardData(data);

        setDashboardData((prev) => ({
          ...prev,
          // Update dengan data dari API jika diperlukan
        }));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty array = fetch hanya saat component mount

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
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

  const handleTaskToggle = (index) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
          <p className="text-destructive font-semibold">Error</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      p-6
      space-y-6
      bg-gradient-to-br
      from-sky-100
      via-cyan-50
      to-blue-100
      "
    >

      {/* Header */}

      <div>

        <h1
          className="
          text-3xl
          font-bold
          text-slate-800
          "
        >
          Dashboard Laundry
        </h1>

        <p className="text-slate-500">
          Sistem Laundry Management
        </p>

      </div>


      {/* Statistik */}

      <div
        className="
        grid
        gap-5
        md:grid-cols-2
        lg:grid-cols-4
        "
      >

        {/* Pelanggan */}

        <Card
          className="
          group
          backdrop-blur-md
          bg-orange-500
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:scale-105
          hover:-translate-y-2
          hover:shadow-2xl
          cursor-pointer
          "
        >

          <CardHeader
            className="
            flex
            flex-row
            justify-between
            items-center
            "
          >

            <CardTitle>
              Total Pelanggan
            </CardTitle>

            <Users
              className="
              h-5
              w-5
              transition-transform
              duration-300
              group-hover:rotate-12
              "
            />

          </CardHeader>

          <CardContent>

            <div className="text-3xl font-bold">
              {dashboardData.totalCustomers}
            </div>

            <p className="text-sm opacity-90">
              +15 pelanggan minggu ini
            </p>

          </CardContent>

        </Card>


        {/* Order */}

        <Card
          className="
          group
          bg-blue-500
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:scale-105
          hover:-translate-y-2
          hover:shadow-2xl
          cursor-pointer
          "
        >

          <CardHeader
            className="
            flex
            flex-row
            justify-between
            "
          >

            <CardTitle>
              Order Masuk
            </CardTitle>

            <TrendingUp
              className="
              h-5
              w-5
              transition-transform
              duration-300
              group-hover:rotate-12
              "
            />

          </CardHeader>

          <CardContent>

            <div className="text-3xl font-bold">
              {dashboardData.incomingOrders}
            </div>

            <p className="text-sm">
              12 sedang diproses
            </p>

          </CardContent>

        </Card>


        {/* Laundry selesai */}

        <Card
          className="
          group
          bg-purple-500
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:scale-105
          hover:-translate-y-2
          hover:shadow-2xl
          cursor-pointer
          "
        >

          <CardHeader
            className="
            flex
            flex-row
            justify-between
            "
          >

            <CardTitle>
              Laundry Selesai
            </CardTitle>

            <Package
              className="
              h-5
              w-5
              transition-transform
              duration-300
              group-hover:rotate-12
              "
            />

          </CardHeader>

          <CardContent>

            <div className="text-3xl font-bold">
              {dashboardData.completedLaundry}
            </div>

            <p className="text-sm">
              Siap diambil pelanggan
            </p>

          </CardContent>

        </Card>


        {/* Pendapatan */}

        <Card
          className="
          group
          bg-green-500
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:scale-105
          hover:-translate-y-2
          hover:shadow-2xl
          cursor-pointer
          "
        >

          <CardHeader
            className="
            flex
            flex-row
            justify-between
            "
          >

            <CardTitle>
              Pendapatan
            </CardTitle>

            <DollarSign
              className="
              h-5
              w-5
              transition-transform
              duration-300
              group-hover:rotate-12
              "
            />

          </CardHeader>

          <CardContent>

            <div className="text-3xl font-bold">
              {dashboardData.revenue}
            </div>

            <p className="text-sm">
              +18% bulan ini
            </p>

          </CardContent>

        </Card>

      </div>


      {/* Grafik */}

      <Card
        className="
        bg-white/70
        backdrop-blur-md
        shadow-xl
        "
      >

        <CardHeader>

          <CardTitle>
            Grafik Pesanan Laundry
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="h-[320px]">

            <Line
              data={dashboardData.chartData}
              options={chartOptions}
            />

          </div>

        </CardContent>

      </Card>


      {/* Aktivitas dan tugas */}

      <div
        className="
        grid
        gap-5
        lg:grid-cols-2
        "
      >

        <Card
          className="
          bg-white/70
          backdrop-blur-md
          "
        >

          <CardHeader>

            <CardTitle>
              Aktivitas Terbaru
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-4">

              {dashboardData.activities.map((item) => (

                <div
                  key={item}
                  className="
                  p-3
                  rounded-lg
                  transition-all
                  duration-300
                  hover:bg-blue-100
                  hover:translate-x-2
                  cursor-pointer
                  "
                >

                  {item}

                </div>

              ))}

            </div>

          </CardContent>

        </Card>


        <Card
          className="
          bg-white/70
          backdrop-blur-md
          "
        >

          <CardHeader>

            <CardTitle>
              Tugas Hari Ini
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-3">

              {dashboardData.tasks.map((task, index) => (

                <label
                  key={task}
                  className="
                  flex
                  gap-3
                  p-2
                  rounded-lg
                  transition-all
                  duration-300
                  hover:bg-slate-100
                  hover:translate-x-2
                  cursor-pointer
                  "
                >

                  <input
                    type="checkbox"
                    checked={checkedTasks[index] || false}
                    onChange={() => handleTaskToggle(index)}
                    className="
                    accent-blue-500
                    "
                  />

                  <span
                    className={
                      checkedTasks[index]
                        ? "line-through text-slate-500"
                        : ""
                    }
                  >
                    {task}
                  </span>

                </label>

              ))}

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}