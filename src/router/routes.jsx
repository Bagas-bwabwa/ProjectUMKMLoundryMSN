import { Suspense, lazy } from "react";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { GuestRoute } from "@/components/routing/GuestRoute";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { InvestorRouteGuard } from "@/components/routing/InvestorRouteGuard";
import { PageLoading } from "@/components/layout/PageLoading";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const DashboardPage = lazy(() => import("@/pages/admin/Dashboard"));
const TransactionPage = lazy(() => import("@/pages/admin/Transaction"));
const TransactionDetailPage = lazy(() => import("@/pages/admin/TransactionDetailPage"));
const OutletDetail = lazy(() => import("@/pages/admin/OutletDetail"));
const ReportPage = lazy(() => import("@/pages/admin/Report"));
const InvestorReportPage = lazy(() => import("@/pages/admin/InvestorReport"));
const OutletPage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.OutletPage })));
const EmployeePage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.EmployeePage })));
const KasirAccountPage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.KasirAccountPage })));
const InvestorPage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.InvestorPage })));
const ServicePage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.ServicePage })));
const ItemPage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.ItemPage })));
const StockPage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.StockPage })));
const ExpensePage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.ExpensePage })));
const MaterialUsagePage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.MaterialUsagePage })));
const SalaryPage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.SalaryPage })));
const DailyReportPage = lazy(() => import("@/pages/admin/CrudPages").then((m) => ({ default: m.DailyReportPage })));

function RootSuspenseLayout() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Outlet />
    </Suspense>
  );
}

function normalizeBasename(base) {
  if (!base || base === "/") return "/";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

const basename = normalizeBasename(import.meta.env.BASE_URL);

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
              { index: true, element: <Navigate to="/dashboard" replace /> },
              { path: "dashboard", element: <DashboardPage /> },
              { path: "reports", element: <ReportPage /> },
              { path: "investor-reports", element: <InvestorReportPage /> },
              {
                element: <InvestorRouteGuard />,
                children: [
                  { path: "outlets", element: <OutletPage /> },
                  { path: "outlets/:id", element: <OutletDetail /> },
                  { path: "employees", element: <EmployeePage /> },
                  { path: "kasir-accounts", element: <KasirAccountPage /> },
                  { path: "investors", element: <InvestorPage /> },
                  { path: "services", element: <ServicePage /> },
                  { path: "items", element: <ItemPage /> },
                  { path: "stocks", element: <StockPage /> },
                  { path: "transactions", element: <TransactionPage /> },
                  { path: "transactions/create", element: <Navigate to="/transactions" replace /> },
                  { path: "transactions/:id", element: <TransactionDetailPage /> },
                  { path: "expenses", element: <ExpensePage /> },
                  { path: "daily-reports", element: <DailyReportPage /> },
                  { path: "salary", element: <SalaryPage /> },
                  { path: "materials", element: <MaterialUsagePage /> },
                  { path: "settings", element: <SettingsPage /> },
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

export const router = createBrowserRouter(routeTree, { basename });
