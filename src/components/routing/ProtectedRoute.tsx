import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/router/paths";
import { isAuthenticated } from "@/services/authService";

/** Membungkus cabang yang butuh sesi login. */
export function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
}
