import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import {
  useParams,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Course from "./AdminSide/Course.jsx";
import Admin from "./Admin.jsx";
import LoginPage from "./LoginPage.jsx";
import CourseList from "./AdminSide/CourseList.jsx";
import AdminMainPage from "./AdminSide/AdminMainPage.jsx";
import Analytics from "./pages/Analytics.jsx";
import Courses from "./AdminSide/Courses.jsx";
import CourseInfo from "./AdminSide/CourseInfo.jsx";
import Staff from "./AdminSide/Staff.jsx";
import Maintenance from "./AdminSide/Maintenance.jsx";
import Settings from "./AdminSide/Settings.jsx";
import { DrawerProvider } from "./context/DrawerContext.jsx";

/**
 * Retrieves the account data from localStorage.
 *
 * @returns {Object|null} The account object if found, otherwise null.
 */

const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "admin",
    element: <Admin />,
  },
  {
    path: "admin2",
    element: <AdminMainPage />,
    children: [
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "courses/:id",
        element: <CourseInfo />,
      },
      {
        path: "staff",
        element: <Staff />,
      },
      {
        path: "maintenance",
        element: <Maintenance />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "admin/new",
    element: <CourseList />,
  },
  {
    path: "LoginPage",
    element: <LoginPage />,
  },
  {
    path: `LoginPage/admin`,
    element: <Admin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <ModalsProvider>
      <DrawerProvider>
        <RouterProvider router={routers} />
      </DrawerProvider>
    </ModalsProvider>
  </MantineProvider>,
);
