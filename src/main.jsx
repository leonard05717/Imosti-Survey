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
      <RouterProvider router={routers} />
    </ModalsProvider>
  </MantineProvider>,
);
