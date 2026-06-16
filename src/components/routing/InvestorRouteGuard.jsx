import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/router/paths";
import { getCurrentUser } from "@/services/authService";

/** Blokir investor mengakses halaman selain dashboard & laporan keuangan. */
export function InvestorRouteGuard() {
  const user = getCurrentUser();

  if (user?.role === "investor") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
