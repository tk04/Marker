import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Project from "./Project.tsx";
import { lazy } from "react";
const Project = lazy(() => import("./Project.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/project/:id",
    element: <Project />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
