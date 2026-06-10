import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/router/paths";
import { isAuthenticated } from "@/services/authService";

export function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}