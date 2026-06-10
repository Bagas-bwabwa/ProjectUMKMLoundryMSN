import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  Building2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Users,
  Sparkles,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer.jsx";
import { ROUTES } from "@/router/paths";
import { cn } from "@/lib/utils.js";

export function MainLayout() {

  const location = useLocation();

  const [sidebarOpen,setSidebarOpen] = useState(true);

  const [isMobile,setIsMobile] = useState(false);

  const navigation = useMemo(() => [

    {
      name:"Dashboard",
      path:ROUTES.DASHBOARD,
      icon:LayoutDashboard
    },

      {
    name:"Pelanggan",
    path:"/customers",
    icon:Users
  },

    {
      name:"Laundry",
      path:ROUTES.COMPANIES,
      icon:Building2
    },

    {
      name:"Pesanan",
      path:ROUTES.TASKS,
      icon:CheckSquare
    },

    {
      name:"Laporan",
      path:ROUTES.REPORTS,
      icon:BarChart3
    },

    {
      name:"Dokumentasi",
      path:ROUTES.DOCS,
      icon:BookOpen
    },

    {
      name:"Pengaturan",
      path:ROUTES.SETTINGS,
      icon:Settings
    }

  ],[]);

  useEffect(()=>{

    function checkMobile(){

      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);

      setSidebarOpen(!mobile);

    }

    checkMobile();

    window.addEventListener(
      "resize",
      checkMobile
    );

    return ()=>{

      window.removeEventListener(
        "resize",
        checkMobile
      );

    };

  },[]);

  function navIsActive(path){

    return location.pathname.startsWith(path);

  }

  return (

    <div
      className="
      flex
      h-screen
      bg-gradient-to-br
      from-sky-100
      via-cyan-50
      to-blue-100
      "
    >

      <aside

        className={cn(

          `
          transition-all
          duration-300
          shadow-2xl
          backdrop-blur-lg
          bg-white/80
          border-r
          border-white/30
          flex
          flex-col
          overflow-hidden
          `,

          sidebarOpen
          ? "w-64"
          : "w-20"

        )}

      >

        {/* Logo */}

        <div
          className="
          p-5
          border-b
          flex
          items-center
          justify-between
          "
        >

          {sidebarOpen && (

            <div
              className="
              flex
              items-center
              gap-2
              "
            >

              <Sparkles
                className="
                text-cyan-500
                "
              />

              <h1
                className="
                font-bold
                text-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                bg-clip-text
                text-transparent
                "
              >

                LaundryQ

              </h1>

            </div>

          )}

          <button

            onClick={()=>
              setSidebarOpen(
                !sidebarOpen
              )
            }

            className="
            p-2
            rounded-lg
            hover:bg-cyan-100
            transition
            "

          >

            {

              sidebarOpen

              ?

              <ChevronLeft/>

              :

              <ChevronRight/>

            }

          </button>

        </div>


        {/* Menu */}

        <nav
          className="
          flex-1
          p-3
          space-y-2
          "
        >

          {

            navigation.map(item=>{

              const Icon = item.icon;

              const active =
              navIsActive(item.path);

              return(

                <NavLink

                  key={item.path}

                  to={item.path}

                  className={cn(

                    `
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-300
                    group
                    `,

                    active

                    ?

                    `
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-500
                    text-white
                    shadow-lg
                    scale-105
                    `

                    :

                    `
                    hover:bg-cyan-100
                    hover:translate-x-2
                    hover:shadow-md
                    `

                  )}

                >

                  <Icon

                    size={20}

                    className="
                    group-hover:rotate-12
                    transition-transform
                    "
                  />

                  {

                    sidebarOpen &&

                    <span>

                      {item.name}

                    </span>

                  }

                </NavLink>

              );

            })

          }

        </nav>

      </aside>


      {/* Content */}

      <div
        className="
        flex-1
        flex
        flex-col
        overflow-hidden
        "
      >

        <Navbar
          onToggleSidebar={
            ()=>setSidebarOpen(
              !sidebarOpen
            )
          }
        />

        <main
          className="
          flex-1
          overflow-auto
          p-6
          "
        >

          <Outlet/>

        </main>

        <Footer/>

      </div>

    </div>

  );

}