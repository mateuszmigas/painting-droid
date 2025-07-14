import { useEffect } from "react";
import { useSettingsStore } from "@/store";
import { applyTheme } from "@/utils/theme";

export const useSyncTheme = () => {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") {
      return;
    }

    const onMediaQueryChange = () => applyTheme("system");
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", onMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", onMediaQueryChange);
  }, [theme]);
};
