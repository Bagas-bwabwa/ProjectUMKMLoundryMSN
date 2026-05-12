import { Link, useLocation } from "react-router-dom";

export function NotFound() {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-7xl font-extrabold text-primary mb-4">404</h1>

      <h2 className="text-2xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>

      <p className="text-muted-foreground mb-6 max-w-md">
        Sepertinya kamu nyasar ke halaman yang nggak ada. Bisa jadi URL-nya
        salah, atau halamannya memang sudah menghilang seperti harapan mantan.
      </p>

      <div className="mb-6 text-sm text-muted-foreground">
        Path: <span className="font-mono">{location.pathname}</span>
      </div>

      <div className="flex gap-3">
        <Link to="/">
          <button
            className="px-4 py-2 rounded-md bg-primary text-white hover:opacity-90"
            type="button"
          >
            Kembali ke Beranda
          </button>
        </Link>

        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-md border hover:bg-muted"
          type="button"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

