/**
 * Route path constants — satu sumber kebenaran untuk navigasi & deep links.
 * Di materi Pertemuan 7: nested routes memakai segmen konsisten di sini.
 */
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  DASHBOARD_ANALYTICS: "/dashboard/analytics",
  CONTACTS: "/contacts",
  contactDetail: (id) => `/contacts/${encodeURIComponent(id)}`,
  COMPANIES: "/companies",
  // DEALS: "/deals",
  TASKS: "/tasks",
  REPORTS: "/transactions",
  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_NOTIFICATIONS: "/settings/notifications",
  SETTINGS_SECURITY: "/settings/security",
  DOCS: "/docs",
  HOME_REDIRECT: "/dashboard",
};
