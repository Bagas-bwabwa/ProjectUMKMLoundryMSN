import { Suspense, lazy } from "react";
import {
  Navigate,
  Outlet,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { GuestRoute } from "@/components/routing/GuestRoute";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PageLoading } from "@/components/layout/PageLoading";
/** Lazy-loaded route modules — materi Pertemuan 7: code splitting + Suspense. */
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardLayoutPage = lazy(() => import("@/pages/DashboardLayoutPage"));
const DashboardOverviewPage = lazy(() => import("@/pages/DashboardOverviewPage"));
const DashboardAnalyticsPage = lazy(() => import("@/pages/DashboardAnalyticsPage"));
const ContactsPage = lazy(() => import("@/pages/ContactsPage"));
const ContactDetailPage = lazy(() => import("@/pages/ContactDetailPage"));
const CompaniesPage = lazy(() => import("@/pages/CompaniesPage"));
const DealsPage = lazy(() => import("@/pages/DealsPage"));
const TasksPage = lazy(() => import("@/pages/TasksPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const BillingPage = lazy(() => import("@/pages/BillingPage"));
const DocsPage = lazy(() => import("@/pages/DocsPage"));
const SettingsLayoutPage = lazy(() => import("@/pages/SettingsLayoutPage"));
const SettingsProfilePage = lazy(() => import("@/pages/SettingsProfilePage"));
const SettingsNotificationsPage = lazy(
  () => import("@/pages/SettingsNotificationsPage")
);
const SettingsSecurityPage = lazy(() => import("@/pages/SettingsSecurityPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function RootSuspenseLayout() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Outlet />
    </Suspense>
  );
}

/** Basename dari Vite `base` (deploy GitHub Pages membutuhkan ini). */
function normalizeBasename(base: string): string {
  if (!base || base === "/") return "/";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

const basename = normalizeBasename(import.meta.env.BASE_URL);

/**
 * Konfigurasi router terpusat:
 * - Multi layout (Auth vs Main)
 * - Nested routes (/dashboard/*, /settings/*)
 * - Dynamic segment (/contacts/:contactId)
 */
const routeTree: RouteObject[] = [
  {
    element: <RootSuspenseLayout />,
    children: [
      {
        path: "login",
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [{ index: true, element: <LoginPage /> }],
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
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <DashboardLayoutPage />,
                children: [
                  { index: true, element: <DashboardOverviewPage /> },
                  { path: "analytics", element: <DashboardAnalyticsPage /> },
                ],
              },
              { path: "contacts", element: <ContactsPage /> },
              { path: "contacts/:contactId", element: <ContactDetailPage /> },
              { path: "companies", element: <CompaniesPage /> },
              { path: "deals", element: <DealsPage /> },
              { path: "tasks", element: <TasksPage /> },
              { path: "reports", element: <ReportsPage /> },
              { path: "billing", element: <BillingPage /> },
              { path: "docs", element: <DocsPage /> },
              {
                path: "settings",
                element: <SettingsLayoutPage />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="profile" replace />,
                  },
                  { path: "profile", element: <SettingsProfilePage /> },
                  {
                    path: "notifications",
                    element: <SettingsNotificationsPage />,
                  },
                  { path: "security", element: <SettingsSecurityPage /> },
                ],
              },
              { path: "*", element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routeTree, {
  basename,
});
