import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./application";
import "./styles.css";
import { useSettingsStore } from "./store";
import { applyTheme } from "./utils/theme";

// Apply the theme early
applyTheme(useSettingsStore.getState().theme);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

