import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./application";
import "./styles.css";
import { useSettingsStore } from "./store";
import { applyTheme } from "./utils/theme";
import { ErrorBoundary } from "./errorBoundary";

// Apply the theme early
applyTheme(useSettingsStore.getState().theme);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Application />
    </ErrorBoundary>
  </React.StrictMode>
);

