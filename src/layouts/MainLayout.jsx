import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  Building2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  LayoutDashboard,
  Settings,
  Users,
  Sparkles,
  Package,
  Wallet,
  FileText,
  Banknote,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ROUTES } from "@/router/paths";
import { cn } from "@/lib/utils";
import { getCurrentUser, getInvestedOutlets } from "@/services/authService";

const ADMIN_NAV = [
  {
    section: "MAIN MENU",
    items: [{ name: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard }],
  },
  {
    section: "MASTER DATA",
    items: [
      { name: "Outlet", path: ROUTES.OUTLETS, icon: Building2 },
      { name: "Karyawan", path: ROUTES.EMPLOYEES, icon: Users },
      { name: "Investor", path: ROUTES.INVESTORS, icon: Users },
      { name: "Layanan Laundry", path: ROUTES.SERVICES, icon: Sparkles },
      { name: "Item Satuan", path: ROUTES.ITEMS, icon: BookOpen },
    ],
  },
  {
    section: "OPERASIONAL",
    items: [
      { name: "Stok Barang", path: ROUTES.STOCKS, icon: Package },
      { name: "Bahan Pakai", path: ROUTES.MATERIALS, icon: FlaskConical },
      { name: "Transaksi Laundry", path: ROUTES.TRANSACTIONS, icon: CheckSquare },
      { name: "Pengeluaran", path: ROUTES.EXPENSES, icon: Wallet },
      { name: "Pencatatan Gaji", path: ROUTES.SALARY, icon: Banknote },
    ],
  },
  {
    section: "LAPORAN",
    items: [
      { name: "Laporan Keuangan", path: ROUTES.REPORTS, icon: BarChart3 },
      { name: "Laporan Harian", path: ROUTES.DAILY_REPORTS, icon: FileText },
    ],
  },
  {
    section: "PENGATURAN",
    items: [{ name: "Pengaturan", path: ROUTES.SETTINGS, icon: Settings }],
  },
];

const KASIR_NAV = [
  {
    section: "MAIN MENU",
    items: [{ name: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard }],
  },
  {
    section: "OPERASIONAL",
    items: [
      { name: "Stok Barang", path: ROUTES.STOCKS, icon: Package },
      { name: "Bahan Pakai", path: ROUTES.MATERIALS, icon: FlaskConical },
      { name: "Transaksi Laundry", path: ROUTES.TRANSACTIONS, icon: CheckSquare },
      { name: "Pengeluaran", path: ROUTES.EXPENSES, icon: Wallet },
      { name: "Laporan Harian", path: ROUTES.DAILY_REPORTS, icon: FileText },
    ],
  },
];

const INVESTOR_NAV = [
  {
    section: "MAIN MENU",
    items: [{ name: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard }],
  },
  {
    section: "LAPORAN",
    items: [{ name: "Laporan Keuangan", path: ROUTES.REPORTS, icon: BarChart3 }],
  },
];

function getNavigationForRole(role) {
  if (role === "kasir") return KASIR_NAV;
  if (role === "investor") return INVESTOR_NAV;
  return ADMIN_NAV;
}

export function MainLayout() {
  const location = useLocation();
  const user = getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const navigation = useMemo(
    () => getNavigationForRole(user?.role),
    [user?.role]
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

  function navIsActive(path) {
    return location.pathname.startsWith(path);
  }

  const investedOutlets = getInvestedOutlets();
  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "kasir"
        ? "Kasir Outlet"
        : investedOutlets.length
          ? `Investor — ${investedOutlets.join(", ")}`
          : "Investor";

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100">
      <aside
        className={cn(
          "transition-all duration-300 shadow-2xl backdrop-blur-lg bg-white/80 border-r border-white/30 flex flex-col overflow-hidden",
          sidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="p-5 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-500" />
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                LaundryMSN
              </h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-cyan-100 transition"
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {navigation.map((group) => (
            <div key={group.section} className="mb-5">
              {sidebarOpen && (
                <p className="px-4 mb-2 text-xs font-bold text-slate-400 uppercase">
                  {group.section}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = navIsActive(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 group",
                      active
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                        : "hover:bg-cyan-100 hover:translate-x-2 hover:shadow-md"
                    )}
                  >
                    <Icon size={20} className="group-hover:rotate-12 transition-transform" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center font-bold">
            {(user?.name ?? "U").charAt(0)}
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-semibold">{user?.name ?? "User"}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
