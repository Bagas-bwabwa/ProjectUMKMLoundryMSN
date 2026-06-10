import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Materi Pertemuan 11: useEffect dengan dependencies state
 * - Fetch analytics data saat component mount
 * - Loading state management
 * - Error handling dan retry functionality
 */
export function DashboardAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    totalLaundry: 143,
    completedToday: 76,
    revenue: "Rp2.850.000",
    chartData: {
      labels: ["Cuci", "Pengeringan", "Setrika", "Packing", "Selesai"],
      datasets: [
        {
          label: "Proses Laundry",
          data: [42, 35, 28, 20, 18],
          backgroundColor: ["#3B82F6", "#06B6D4", "#8B5CF6", "#22C55E", "#F59E0B"],
          borderRadius: 10,
        },
      ],
    },
    summaryToday: {
      totalOrder: 95,
      completed: 76,
      averageTime: "2 Hari",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect untuk fetch analytics data
   * Dependencies: [] = fetch hanya saat component mount
   */
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulasi API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulasi fetch dari API (bisa diganti dengan actual API call)
        // const response = await fetch('/api/analytics');
        // const data = await response.json();

        // Untuk demo, data sudah di-set di state awal
        setAnalyticsData((prev) => ({
          ...prev,
          // Bisa update dengan API response di sini
        }));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []); // Empty dependencies = hanya run sekali saat mount

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

  if (loading) {
    return (
      <div className="min-h-screen space-y-6 p-2 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen space-y-6 p-2 flex items-center justify-center">
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

              {analyticsData.totalLaundry}

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

              {analyticsData.completedToday}

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

              {analyticsData.revenue}

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
            data={analyticsData.chartData}
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

            <b>{analyticsData.summaryToday.totalOrder}</b>

          </div>

          <div
            className="
            flex
            justify-between
            "
          >

            <span>Pesanan Selesai</span>

            <b>{analyticsData.summaryToday.completed}</b>

          </div>

          <div
            className="
            flex
            justify-between
            "
          >

            <span>Rata-rata Waktu</span>

            <b>{analyticsData.summaryToday.averageTime}</b>

          </div>

        </CardContent>

      </Card>

    </div>

  );

}

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