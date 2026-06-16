import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  BarChart3, TrendingUp, Wallet, Receipt, Download, FileSpreadsheet, Search,
} from "lucide-react";
import { RevenueBarChart } from "@/components/charts/RevenueChart";
import { useLocalData, getLocalData } from "@/hooks/useLocalData";
import {
  transactions as initialTx,
  expenses as initialExpenses,
  formatRupiah,
} from "@/data/laundryData";
import { CRUD_CONFIGS } from "@/data/pageConfigs";
import { getCurrentUser } from "@/services/authService";
import {
  buildFinancialSummary,
  getDateRange,
  getLayananLabel,
  getQtyLabel,
  groupByDate,
  normalizeTransaction,
} from "@/utils/reportUtils";
import { exportToExcel, exportToPDF, tableToHtml } from "@/utils/exportUtils";
import { ROUTES } from "@/router/paths";
import { api } from "@/services/apiClient";

const REPORT_COLUMNS = [
  { label: "ID", getValue: (r) => r.invoice },
  { label: "Pelanggan", getValue: (r) => r.customer },
  { label: "Tanggal", getValue: (r) => r.tanggal },
  { label: "Jenis", getValue: (r) => r.layananType },
  { label: "Layanan", getValue: (r) => getLayananLabel(r) },
  { label: "Berat/Qty", getValue: (r) => String(getQtyLabel(r)) },
  { label: "Subtotal", getValue: (r) => r.subtotal },
  { label: "Diskon", getValue: (r) => r.diskon },
  { label: "Total", getValue: (r) => r.total },
  { label: "Metode Bayar", getValue: (r) => r.metodePembayaran },
  { label: "Status Bayar", getValue: (r) => r.paymentStatus },
  { label: "Kasir", getValue: (r) => r.kasir },
  { label: "Outlet", getValue: (r) => r.outlet },
];

export default function ReportPage() {
  const user = getCurrentUser();
  if (user?.role === "investor") {
    return <Navigate to={ROUTES.INVESTOR_REPORTS} replace />;
  }

  const { data: localTxData } = useLocalData("transactions", initialTx);
  const { data: localExpData } = useLocalData("expenses", initialExpenses);
  const [txData, setTxData] = useState(localTxData);
  const [expData, setExpData] = useState(localExpData);
  const outlets = getLocalData(CRUD_CONFIGS.outlets.storageKey, CRUD_CONFIGS.outlets.initialData);
  const kasirList = getLocalData("kasirAccounts", CRUD_CONFIGS.kasirAccounts.initialData);

  const [periode, setPeriode] = useState("bulanan");
  const [filterOutlet, setFilterOutlet] = useState("");
  const [filterKasir, setFilterKasir] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    let mounted = true;
    async function fetchInitialData() {
      try {
        const [txRes, expRes] = await Promise.all([
          api.transactions.getAll(),
          api.expenses.getAll(),
        ]);
        if (!mounted) return;
        const txRows = Array.isArray(txRes?.data?.data) ? txRes.data.data : txRes?.data;
        const expRows = Array.isArray(expRes?.data?.data) ? expRes.data.data : expRes?.data;
        if (Array.isArray(txRows)) setTxData(txRows);
        if (Array.isArray(expRows)) setExpData(expRows);
      } catch {
        if (!mounted) return;
        setTxData(localTxData);
        setExpData(localExpData);
      }
    }
    fetchInitialData();
    return () => {
      mounted = false;
    };
  }, [localTxData, localExpData]);

  const periodRange = useMemo(() => getDateRange(periode), [periode]);
  const effectiveFrom = dateFrom || periodRange.dateFrom;
  const effectiveTo = dateTo || periodRange.dateTo;

  const filters = useMemo(() => ({
    dateFrom: effectiveFrom,
    dateTo: effectiveTo,
    outlet: user?.role === "kasir" ? user.outlet : filterOutlet || undefined,
    kasir: filterKasir || undefined,
    customer: filterCustomer || undefined,
    search: search || undefined,
  }), [effectiveFrom, effectiveTo, filterOutlet, filterKasir, filterCustomer, search, user]);

  const summary = useMemo(
    () => buildFinancialSummary(txData, expData, filters),
    [txData, expData, filters]
  );

  const rekapHarian = useMemo(() => groupByDate(summary.transactions), [summary.transactions]);

  const chartLabels = rekapHarian.map((d) => d.tanggal.slice(5));
  const chartPendapatan = rekapHarian.map((d) => d.pendapatan);

  function handleExportPDF() {
    exportToPDF(
      `Laporan Keuangan — ${periode}`,
      tableToHtml(summary.transactions.map(normalizeTransaction), REPORT_COLUMNS)
    );
  }

  function handleExportExcel() {
    exportToExcel(
      summary.transactions.map(normalizeTransaction),
      REPORT_COLUMNS,
      `laporan-keuangan-${periode}`
    );
  }

  return (
    <div id="laporan-print">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Laporan Keuangan</h1>
          <p className="text-slate-500">
            {user?.role === "kasir"
              ? `Laporan outlet ${user.outlet}`
              : "Detail transaksi & rekap keuangan"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleExportPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
            <Download size={16} /> Export PDF
          </button>
          <button type="button" onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
            <FileSpreadsheet size={16} /> Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 mb-6 print:hidden space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select value={periode} onChange={(e) => setPeriode(e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400">
            <option value="harian">Rekap Harian</option>
            <option value="mingguan">Rekap Mingguan</option>
            <option value="bulanan">Rekap Bulanan</option>
            <option value="tahunan">Rekap Tahunan</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded-xl px-4 py-3" placeholder="Dari tanggal" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="border rounded-xl px-4 py-3" placeholder="Sampai tanggal" />
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
            <input type="text" placeholder="Cari transaksi..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 border rounded-xl" />
          </div>
        </div>
        {user?.role !== "kasir" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={filterOutlet} onChange={(e) => setFilterOutlet(e.target.value)}
              className="border rounded-xl px-4 py-3">
              <option value="">Semua Outlet</option>
              {outlets.map((o) => <option key={o.id} value={o.nama}>{o.nama}</option>)}
            </select>
            <select value={filterKasir} onChange={(e) => setFilterKasir(e.target.value)}
              className="border rounded-xl px-4 py-3">
              <option value="">Semua Kasir</option>
              {kasirList.map((k) => <option key={k.id} value={k.nama}>{k.nama}</option>)}
            </select>
            <input type="text" placeholder="Filter pelanggan..."
              value={filterCustomer} onChange={(e) => setFilterCustomer(e.target.value)}
              className="border rounded-xl px-4 py-3" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">Pendapatan</p>
          <h2 className="text-2xl font-bold text-green-600">{formatRupiah(summary.pendapatan)}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">Pengeluaran</p>
          <h2 className="text-2xl font-bold text-red-600">{formatRupiah(summary.pengeluaran)}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">Laba Bersih</p>
          <h2 className="text-2xl font-bold text-cyan-600">{formatRupiah(summary.labaBersih)}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-slate-500">Transaksi / Pelanggan</p>
          <h2 className="text-2xl font-bold">{summary.totalTransaksi} / {summary.totalPelanggan}</h2>
        </div>
      </div>

      {chartLabels.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 print:hidden">
          <h2 className="font-bold text-xl mb-4 capitalize">Grafik Rekap {periode}</h2>
          <RevenueBarChart labels={chartLabels} pendapatan={chartPendapatan} pengeluaran={[]} />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="p-5 border-b"><h2 className="font-bold text-xl">Rekap Per Hari</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Tanggal</th>
                <th className="p-4 text-left">Transaksi</th>
                <th className="p-4 text-left">Pelanggan</th>
                <th className="p-4 text-left">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {rekapHarian.map((d) => (
                <tr key={d.tanggal} className="border-t">
                  <td className="p-4">{d.tanggal}</td>
                  <td className="p-4">{d.transaksi}</td>
                  <td className="p-4">{d.pelanggan}</td>
                  <td className="p-4 text-green-600 font-semibold">{formatRupiah(d.pendapatan)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b"><h2 className="font-bold text-xl">Detail Transaksi</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-slate-100">
              <tr>
                {REPORT_COLUMNS.map((c) => (
                  <th key={c.label} className="p-3 text-left whitespace-nowrap">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.transactions.map((tx) => {
                const r = normalizeTransaction(tx);
                return (
                  <tr key={r.id} className="border-t hover:bg-slate-50">
                    {REPORT_COLUMNS.map((c) => (
                      <td key={c.label} className="p-3 whitespace-nowrap">
                        {["Subtotal", "Diskon", "Total"].includes(c.label)
                          ? formatRupiah(c.getValue(r))
                          : c.getValue(r)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
