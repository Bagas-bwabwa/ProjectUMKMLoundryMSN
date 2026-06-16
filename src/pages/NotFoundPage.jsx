import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/router/paths";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-7xl font-extrabold text-cyan-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-slate-500 mb-6 max-w-md">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <p className="text-sm text-slate-400 mb-6">
        Path: <span className="font-mono">{location.pathname}</span>
      </p>
      <div className="flex gap-3">
        <Link
          to={ROUTES.DASHBOARD}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
        >
          Ke Dashboard
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-xl border hover:bg-slate-50"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
