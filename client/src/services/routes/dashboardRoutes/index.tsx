import { Navigate, Outlet, RouteObject } from "react-router";

import { dashboardPaths } from "./paths";
import { Dashboard , News } from "../../../pages";
import Chatbot from "../../../pages/Chatbot/Chatbot";
import { DashboardLayout } from "../../../layout";
import { useUser } from "../../../context";
import Recommendation from "../../../pages/Recommendation/recommendation";
import About from "../../../pages/About/About";
import FAQ from "../../../pages/FAQ/FAQ";
import Contact from "../../../pages/Contact/Contact";

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
        path: dashboardPaths.myNews.relative,
        element: <News />,
      },
      {
        path: dashboardPaths.Recommendation.relative,
        // element: <div>Recommandation</div>,
        element: <Recommendation />,
      },
      //{ path: dashboardPaths.chatBot.relative, element: <div>Chat Bot</div> },
      {
        path: dashboardPaths.chatBot.relative,
        element: <Chatbot />,
      },
      {
        path: dashboardPaths.About.relative,
        element: <About />,
      },
      {
        path: dashboardPaths.FAQ.relative,
        element: <FAQ />,
      },
      {
        path: dashboardPaths.Contact.relative,
        element: <Contact />,
      },
    ],
  },
];

export * from "./paths";
