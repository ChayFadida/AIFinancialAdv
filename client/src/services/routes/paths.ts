import { authPaths } from "./authRoutes/paths";
import { dashboardPaths } from "./dashboardRoutes";

export const paths = {
  auth: authPaths,
  dashboard: dashboardPaths,
  portfolio: '/portfolio',
} as const;
