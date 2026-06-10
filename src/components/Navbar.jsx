import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";
import { ROUTES } from "@/router/paths";
import { logout as authLogout } from "@/services/authService";

export function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log("Search:", searchQuery);
  };

  // const navigateToBilling = () => {
  //   navigate(ROUTES.BILLING);
  //   setAccountDropdownOpen(false);
  // };

  /** Logout: hapus token lokal lalu ke halaman login (Pertemuan 7 — auth flow). */
  const handleLogout = () => {
    authLogout();
    setAccountDropdownOpen(false);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!accountDropdownOpen) return;
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !dropdownRef.current.contains(e.target)
      ) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [accountDropdownOpen]);

  return (
    <nav className="bg-card border-b sticky top-0 z-40">
      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-accent rounded-md"
              aria-label="Toggle menu"
              type="button"
            >
              <Menu size={20} />
            </button>

            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-64 lg:w-96"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSidebar}
              className="hidden lg:block p-2 hover:bg-accent rounded-md"
              aria-label="Toggle sidebar"
              type="button"
            >
              <Menu size={20} />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md"
                aria-label="Account menu"
                type="button"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <User size={18} />
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  Qucuci
                </span>
                <ChevronDown size={16} className="hidden sm:block" />
              </button>

              {accountDropdownOpen ? (
                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">Laundry Qucuci</p>
                    <p className="text-xs text-muted-foreground">
                      qucucy@gmail.com
                    </p>
                  </div>

                  {/* <button
                    onClick={navigateToBilling}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                    type="button"
                  >
                    <CreditCard size={16} />
                    <span>Billing</span>
                  </button> */}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent text-red-600"
                    type="button"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}
