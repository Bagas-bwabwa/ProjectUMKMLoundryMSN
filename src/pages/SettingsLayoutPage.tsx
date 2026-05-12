import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "@/router/paths";
import { cn } from "@/lib/utils.js";

const tabs = [
  { label: "Profile", to: ROUTES.SETTINGS_PROFILE },
  { label: "Notifications", to: ROUTES.SETTINGS_NOTIFICATIONS },
  { label: "Security", to: ROUTES.SETTINGS_SECURITY },
] as const;

/** Parent route /settings — anak-anak dirender lewat <Outlet />. */
export default function SettingsLayoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Nested routes untuk memisahkan concern UI (multi-segment).
        </p>
      </div>

      <nav
        className="flex flex-wrap gap-2 rounded-lg border bg-card p-1 text-sm"
        aria-label="Settings sections"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
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

      <Outlet />
    </div>
  );
}
