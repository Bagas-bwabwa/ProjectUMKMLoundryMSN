import { Suspense, lazy } from "react";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { GuestRoute } from "@/components/routing/GuestRoute";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { InvestorRouteGuard } from "@/components/routing/InvestorRouteGuard";
import { PageLoading } from "@/components/layout/PageLoading";

import DashboardPage from "@/pages/admin/Dashboard";
import TransactionPage from "@/pages/admin/Transaction";
import TransactionDetailPage from "@/pages/admin/TransactionDetailPage";
import OutletDetail from "@/pages/admin/OutletDetail";
import ReportPage from "@/pages/admin/Report";
import {
  OutletPage,
  EmployeePage,
  InvestorPage,
  ServicePage,
  ItemPage,
  StockPage,
  ExpensePage,
  MaterialUsagePage,
  SalaryPage,
  DailyReportPage,
} from "@/pages/admin/CrudPages";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

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
              {
                element: <InvestorRouteGuard />,
                children: [
                  { path: "outlets", element: <OutletPage /> },
                  { path: "outlets/:id", element: <OutletDetail /> },
                  { path: "employees", element: <EmployeePage /> },
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
