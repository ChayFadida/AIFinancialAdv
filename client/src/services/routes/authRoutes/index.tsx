import { Navigate, Outlet, RouteObject } from "react-router";

import { authPaths } from "./paths";

import { useUser } from "../../../context";
import { paths } from "../paths";
import { Login } from "../../../pages";
import { Register } from "../../../pages/Register";

function Layout() {
  const { user } = useUser();
  
  if (user?.id) {
    return <Navigate to={paths.dashboard.absolute} />;
  }

  return <Outlet />;
}

export const authRoutes: RouteObject[] = [
  {
    path: authPaths.login,
    element: <Layout />,
    children: [{ path: '', element: <Login /> }],
  },
  {
    path: authPaths.register,
    element: <Layout />,
    children: [{ path: '', element: <Register /> }],
  },
];

export * from "./paths";
