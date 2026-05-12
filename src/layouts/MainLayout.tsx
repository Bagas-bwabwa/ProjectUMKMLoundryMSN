import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Building2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer.jsx";
import { ROUTES } from "@/router/paths";
import { cn } from "@/lib/utils.js";

type NavItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

/**
 * Layout utama aplikasi (sidebar + navbar + footer).
 * NavLink memakai segment awal agar nested route tetap aktif (mis. /dashboard/analytics).
 */
export function MainLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const navigation = useMemo<NavItem[]>(
    () => [
      { name: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { name: "Contacts", path: ROUTES.CONTACTS, icon: Users },
      { name: "Companies", path: ROUTES.COMPANIES, icon: Building2 },
      { name: "Deals", path: ROUTES.DEALS, icon: TrendingUp },
      { name: "Tasks", path: ROUTES.TASKS, icon: CheckSquare },
      { name: "Reports", path: ROUTES.REPORTS, icon: BarChart3 },
      { name: "Billing", path: ROUTES.BILLING, icon: CreditCard },
      { name: "Settings", path: ROUTES.SETTINGS, icon: Settings },
      { name: "Docs", path: ROUTES.DOCS, icon: BookOpen },
    ],
    []
  );

  useEffect(() => {
    function checkMobile() {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebarOnMobile = () => {
    if (isMobile) setSidebarOpen(false);
  };

  function navIsActive(itemPath: string): boolean {
    if (itemPath === ROUTES.DASHBOARD) {
      return location.pathname.startsWith(ROUTES.DASHBOARD);
    }
    if (itemPath === ROUTES.SETTINGS) {
      return location.pathname.startsWith(ROUTES.SETTINGS);
    }
    if (itemPath === ROUTES.CONTACTS) {
      return location.pathname.startsWith(ROUTES.CONTACTS);
    }
    return location.pathname === itemPath;
  }

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && isMobile ? (
        <div
          onClick={closeSidebarOnMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden
        />
      ) : null}

      <aside
        className={cn(
          "bg-card border-r transition-all duration-300 flex flex-col fixed lg:relative h-full z-50 overflow-hidden",
          isMobile ? (sidebarOpen ? "w-64" : "w-0") : sidebarOpen ? "w-64" : "w-16",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen ? (
            <h3 className="text-sm font-semibold tracking-tight text-primary">
              Laundry Qucuci
            </h3>
          ) : null}

          <button
            onClick={toggleSidebar}
            className={cn(
              "p-2 hover:bg-accent rounded-md hidden lg:block",
              !sidebarOpen ? "mx-auto" : ""
            )}
            type="button"
            aria-label="Toggle sidebar width"
          >
            {!sidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = navIsActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebarOnMobile}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon size={20} />
                {sidebarOpen ? <span>{item.name}</span> : null}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
