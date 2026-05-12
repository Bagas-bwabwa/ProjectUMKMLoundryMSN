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
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { CardTitle } from "@/components/ui/CardTitle.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const pipelineData = {
  labels: ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"],
  datasets: [
    {
      label: "Deals",
      data: [42, 28, 18, 11, 9],
      backgroundColor: "hsla(207, 88%, 42%, 0.72)",
      borderRadius: 6,
    },
  ],
};

const pipelineOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

/** Child route /dashboard/analytics — konten nyata untuk nested route. */
export function DashboardAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
        <Activity className="h-10 w-10 text-primary shrink-0" />
        <div>
          <h2 className="text-lg font-semibold">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Visualisasi pipeline penjualan (halaman nested dari{" "}
            <span className="font-mono">/dashboard/analytics</span>).
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deal pipeline</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <Bar data={pipelineData} options={pipelineOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan minggu ini</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Meetings booked</span>
              <span className="font-medium">14</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Win rate</span>
              <span className="font-medium">38%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. cycle</span>
              <span className="font-medium">27 days</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
