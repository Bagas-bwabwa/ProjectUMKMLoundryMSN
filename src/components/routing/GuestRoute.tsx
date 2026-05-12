import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/router/paths";
import { isAuthenticated } from "@/services/authService";

/** Halaman login: jika sudah auth, hindari akses ulang. */
export function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.HOME_REDIRECT} replace />;
  }
  return <Outlet />;
}
