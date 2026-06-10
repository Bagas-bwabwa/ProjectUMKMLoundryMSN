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
   LAZY PAGES
========================= */

const LoginPage = lazy(() => import("@/pages/LoginPage"));

const DashboardLayoutPage = lazy(
  () => import("@/pages/DashboardLayoutPage")
);

const DashboardOverviewPage = lazy(
  () => import("@/pages/DashboardOverviewPage")
);

const DashboardAnalyticsPage = lazy(
  () => import("@/pages/DashboardAnalyticsPage")
);

const ContactsPage = lazy(
  () => import("@/pages/ContactsPage")
);

const ContactDetailPage = lazy(
  () => import("@/pages/ContactDetailPage")
);

const FinancialReport = lazy(
  () => import("@/pages/FinancialReport")
);

const CompaniesPage = lazy(
  () => import("@/pages/CompaniesPage")
);

const TasksPage = lazy(
  () => import("@/pages/TasksPage")
);

const DocsPage = lazy(
  () => import("@/pages/DocsPage")
);

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
const TransactionsPage = lazy(
  () => import("@/pages/TransactionsPage")
);

const TransactionDetailPage = lazy(
  () => import("@/pages/TransactionDetailPage")
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
                    to="dashboard"
                    replace
                  />
                ),
              },

              {
                path: "dashboard",

                element: (
                  <DashboardLayoutPage />
                ),

                children: [
                  {
                    index: true,
                    element: (
                      <DashboardOverviewPage />
                    ),
                  },

                  {
                    path: "analytics",
                    element: (
                      <DashboardAnalyticsPage />
                    ),
                  },
                ],
              },

              {
                path: "contacts",
                element: <ContactsPage />,
              },

              {
                path: "customers",
                element: <FinancialReport />,
              },

              {
                path: "contacts/:contactId",
                element: <ContactDetailPage />,
              },

              {
                path: "companies",
                element: <CompaniesPage />,
              },
              {
  path: "transactions",
  element: <TransactionsPage />,
},

{
  path: "transactions/:date",
  element: <TransactionDetailPage />,
},

              {
                path: "tasks",
                element: <TasksPage />,
              },

              {
                path: "reports",
                element: <FinancialReport />,
              },

              {
                path: "docs",
                element: <DocsPage />,
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