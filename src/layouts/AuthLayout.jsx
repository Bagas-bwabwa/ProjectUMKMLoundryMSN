import { Outlet } from "react-router-dom";

/**
 * Halaman auth: latar gradient biru laundry (navy → biru langit).
 */
export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c1929] px-4 py-10 font-sans antialiased">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_110%_70%_at_50%_-15%,rgba(56,189,248,0.35),transparent_55%),radial-gradient(ellipse_90%_55%_at_80%_100%,rgba(14,165,233,0.12),transparent),linear-gradient(180deg,#0c1929_0%,#0f4c81_42%,#082f49_100%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[440px] items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
