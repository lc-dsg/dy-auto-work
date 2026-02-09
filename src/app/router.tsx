import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./layout";
import { DashboardPage } from "@/features/dashboard";
import { EditorLayout } from "@/features/editor/layout";
import { ScriptWorkspace } from "@/features/editor/script";
import { StoryboardWorkspace } from "@/features/editor/storyboard";
import { TimelineWorkspace } from "@/features/editor/timeline";
import { SettingsPage } from "@/features/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "editor/:projectId",
        element: <EditorLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="script" replace />,
          },
          {
            path: "script",
            element: <ScriptWorkspace />,
          },
          {
            path: "storyboard",
            element: <StoryboardWorkspace />,
          },
          {
            path: "video",
            element: <TimelineWorkspace />,
          },
        ],
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
