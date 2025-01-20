import { Navigate, RouteObject, useRoutes } from "react-router-dom";

import { dashboardRoutes } from "./dashboardRoutes";
import { authRoutes } from "./authRoutes";

export const AppRoutes = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
    ...authRoutes,
    ...dashboardRoutes,
  ];

  const element = useRoutes(routes);

  return <>{element}</>;
};
