import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "@/router/paths";
import { cn } from "@/lib/utils.js";

/**
 * Layout nested untuk segmen /dashboard/*
 * Menampilkan sub-nav demostrasi nested routing.
 */
export default function DashboardLayoutPage() {
  const tabs = [
    { label: "Overview", to: ROUTES.DASHBOARD, end: true },
    { label: "Analytics", to: ROUTES.DASHBOARD_ANALYTICS, end: true },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Nested routes: overview dan analytics berbagi layout ini.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-2 rounded-lg border bg-card p-1 text-sm"
          aria-label="Dashboard sections"
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
