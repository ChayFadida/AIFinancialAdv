import { Navigate, Outlet, RouteObject } from "react-router";

import { dashboardPaths } from "./paths";
import { Dashboard, Portfolio, News } from "../../../pages";
import Chatbot from "../../../pages/Chatbot/Chatbot";
import { DashboardLayout } from "../../../layout";
import { useUser } from "../../../context";

function Layout() {
  const { user } = useUser();

  if (!user?.id) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export const dashboardRoutes: RouteObject[] = [
  {
    path: dashboardPaths.absolute,
    element: <Layout />,
    children: [
      {
        path: dashboardPaths.absolute,
        element: <Dashboard />,
      },
      {
        path: dashboardPaths.portfolio.relative,
        element: <Portfolio />,
      },
      {
        path: dashboardPaths.myNews.relative,
        element: <News />,
      },
      {
        path: dashboardPaths.newInvestment.relative,
        element: <div>New Investment</div>,
      },
      //{ path: dashboardPaths.chatBot.relative, element: <div>Chat Bot</div> },
      {
        path: dashboardPaths.chatBot.relative,
        element: <Chatbot />,
      },
    ],
  },
];

export * from "./paths";
