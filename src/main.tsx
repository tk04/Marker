import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/globals.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import store from "@/utils/appStore";
import { lazy } from "react";
const Project = lazy(() => import("./Project.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async (p) => {
      const home = new URLSearchParams(p.request.url.split("?")[1]).get("home");
      if (home) return null;
      const currProj = await store.get("currProject");
      if (currProj) {
        return redirect(`/project/${currProj}`);
      }
      return null;
    },
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
