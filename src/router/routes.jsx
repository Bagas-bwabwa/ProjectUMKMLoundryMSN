import { Suspense, lazy } from "react";
import {
  Navigate,
  Outlet,
  createBrowserRouter,
} from "react-router-dom";

import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";

import { GuestRoute } from "@/components/routing/GuestRoute";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PageLoading } from "@/components/layout/PageLoading";

/* =========================
   ADMIN PAGES
========================= */

import DashboardPage from "@/pages/admin/Dashboard";
import OutletPage from "@/pages/admin/Outlet";
import EmployeePage from "@/pages/admin/Employee";
import InvestorPage from "@/pages/admin/Investor";
import ServicePage from "@/pages/admin/Service";
import ItemPage from "@/pages/admin/Item";
import StockPage from "@/pages/admin/Stock";
import TransactionPage from "@/pages/admin/Transaction";
import ExpensePage from "@/pages/admin/Expense";
import ReportPage from "@/pages/admin/Report";
import CreateTransactionPage from "@/pages/admin/CreateTransaction";
import TransactionDetailPage from "@/pages/admin/TransactionDetailPage";
import OutletDetail from "@/pages/admin/OutletDetail";

/* =========================
   PLACEHOLDER PAGES
========================= */

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SettingsLayoutPage = lazy(
  () => import("@/pages/SettingsLayoutPage")
);

const SettingsProfilePage = lazy(
  () => import("@/pages/SettingsProfilePage")
);

const SettingsNotificationsPage = lazy(
  () => import("@/pages/SettingsNotificationsPage")
);

const SettingsSecurityPage = lazy(
  () => import("@/pages/SettingsSecurityPage")
);

const NotFoundPage = lazy(
  () => import("@/pages/NotFoundPage")
);

/* =========================
   ROOT SUSPENSE
========================= */

function RootSuspenseLayout() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Outlet />
    </Suspense>
  );
}

/* =========================
   BASENAME
========================= */

function normalizeBasename(base) {
  if (!base || base === "/") return "/";

  return base.endsWith("/")
    ? base.slice(0, -1)
    : base;
}

const basename = normalizeBasename(
  import.meta.env.BASE_URL
);

/* =========================
   ROUTES
========================= */

const routeTree = [
  {
    element: <RootSuspenseLayout />,

    children: [
      {
        path: "login",

        element: <GuestRoute />,

        children: [
          {
            element: <AuthLayout />,

            children: [
              {
                index: true,
                element: <LoginPage />,
              },
            ],
          },
        ],
      },

      {
        element: <ProtectedRoute />,

        children: [
          {
            element: <MainLayout />,

            children: [
              {
                index: true,

                element: (
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                ),
              },

              {
                path: "dashboard",
                element: <DashboardPage />,
              },

              {
                path: "outlets",
                element: <OutletPage />,
              },
              {
                path: "outlets/:id",
                element: <OutletDetail />,
              },

              {
                path: "employees",
                element: <EmployeePage />,
              },

              {
                path: "investors",
                element: <InvestorPage />,
              },
              {
                path: "services",
                element: <ServicePage />,
              },


              {
                path: "items",
                element: <ItemPage />,
              },

              {
                path: "stocks",
                element: <StockPage />,
              },

              {
                path: "transactions",
                element: <TransactionPage />,
              },
              {
                path: "transactions/:id",
                element: <TransactionDetailPage />,
              },
              {
                path: "transactions/create",
                element: <CreateTransactionPage />,
              },

              {
                path: "expenses",
                element: <ExpensePage />,
              },

              {
                path: "reports",
                element: <ReportPage />,
              },

              {
                path: "settings",

                element: (
                  <SettingsLayoutPage />
                ),

                children: [
                  {
                    index: true,

                    element: (
                      <Navigate
                        to="profile"
                        replace
                      />
                    ),
                  },

                  {
                    path: "profile",
                    element: (
                      <SettingsProfilePage />
                    ),
                  },

                  {
                    path: "notifications",

                    element: (
                      <SettingsNotificationsPage />
                    ),
                  },

                  {
                    path: "security",

                    element: (
                      <SettingsSecurityPage />
                    ),
                  },
                ],
              },

              {
                path: "*",
                element: <NotFoundPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const router =
  createBrowserRouter(routeTree, {
    basename,
  });