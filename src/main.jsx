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
import Security from "./components/Security.jsx";
import Trainee from "./AdminSide/Trainee.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "admin",
    element: <AdminMainPage />,
    children: [
      {
        path: "analytics",
        element: (
          <Security
            page='analytics'
            children={<Analytics />}
          />
        ),
      },
      {
        path: "courses",
        element: (
          <Security
            page='courses'
            children={<Courses />}
          />
        ),
      },
      {
        path: "courses/:id",
        element: (
          <Security
            page='courses'
            children={<CourseInfo />}
          />
        ),
      },
      {
        path: "trainee",
        element: (
          <Security
            page='trainee'
            children={<Trainee />}
          />
        ),
      },
      {
        path: "staff",
        element: (
          <Security
            page='staff'
            children={<Staff />}
          />
        ),
      },
      {
        path: "maintenance",
        element: (
          <Security
            page='maintenance'
            children={<Maintenance />}
          />
        ),
      },
      {
        path: "settings",
        element: (
          <Security
            page='settings'
            children={<Settings />}
          />
        ),
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
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
