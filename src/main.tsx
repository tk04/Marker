import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/globals.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { getProject, getCurrProject } from "@/utils/appStore";
import { lazy } from "react";
import { Toaster } from "./components/ui/toaster.tsx";
import restoreState from "./store/restoreState.ts";
import { ThemeProvider } from "./ThemeProvider.tsx";
import AppSettings from "./components/Settings/AppSettings.tsx";
const Project = lazy(() => import("./Project.tsx"));

restoreState();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async (p) => {
      const home = new URLSearchParams(p.request.url.split("?")[1]).get("home");
      if (home) return null;
      const currProj = await getCurrProject();
      if (currProj) {
        return redirect(`/project/${currProj.id}`);
      }
      return null;
    },
  },

  {
    path: "/project/:id",
    loader: async ({ params }) => {
      const id = params.id as string;
      const project = await getProject(id);
      if (!project) return redirect("/?home=true");
      return { project };
    },
    element: <Project />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppSettings />
      <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
