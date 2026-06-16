import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Users, Receipt, Wallet } from "lucide-react";
import { useLocalData } from "@/hooks/useLocalData";
import { CRUD_CONFIGS } from "@/data/pageConfigs";
import { transactions as initialTx, formatRupiah } from "@/data/laundryData";
import { ROUTES } from "@/router/paths";

export default function OutletDetail() {
  const { id } = useParams();
  const { data: outlets } = useLocalData(
    CRUD_CONFIGS.outlets.storageKey,
    CRUD_CONFIGS.outlets.initialData
  );
  const { data: employees } = useLocalData(
    CRUD_CONFIGS.employees.storageKey,
    CRUD_CONFIGS.employees.initialData
  );
  const { data: investors } = useLocalData(
    CRUD_CONFIGS.investors.storageKey,
    CRUD_CONFIGS.investors.initialData
  );
  const { data: transactions } = useLocalData("transactions", initialTx);

  const outlet = outlets.find((o) => String(o.id) === String(id));

  if (!outlet) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Outlet tidak ditemukan</p>
        <Link to={ROUTES.OUTLETS} className="text-cyan-600 hover:underline">
          Kembali ke daftar outlet
        </Link>
      </div>
    );
  }

  const outletTx = transactions.filter(
    (t) => t.outlet === outlet.nama && !t.cancelled
  );
  const pendapatan = outletTx.reduce((s, t) => s + t.total, 0);
  const totalKaryawan = employees.filter((e) => e.outlet === outlet.nama).length;
  const totalInvestor = investors.filter((i) => i.outlet === outlet.nama).length;

  const stats = [
    { label: "Total Karyawan", value: totalKaryawan, icon: Users },
    { label: "Total Investor", value: totalInvestor, icon: Wallet },
    { label: "Total Transaksi", value: outletTx.length, icon: Receipt },
    { label: "Pendapatan", value: formatRupiah(pendapatan), icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Detail Outlet</h1>
          <p className="text-slate-500">Informasi lengkap outlet</p>
        </div>
        <Link
          to={ROUTES.OUTLETS}
          className="flex items-center gap-2 px-4 py-3 bg-slate-200 rounded-xl hover:bg-slate-300"
        >
          <ArrowLeft size={18} />
          Kembali
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2">{outlet.nama}</h2>
        <p className="text-slate-500">{outlet.alamat}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span>Kota: {outlet.kota}</span>
          <span>Telepon: {outlet.telepon}</span>
          <span
            className={`px-3 py-1 rounded-full ${
              outlet.status === "Aktif"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {outlet.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Icon className="text-cyan-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">{item.label}</p>
                <h3 className="text-xl font-bold">{item.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
