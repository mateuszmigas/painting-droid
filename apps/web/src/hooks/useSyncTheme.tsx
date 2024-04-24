import { useSettingsStore } from "@/store";
import { applyTheme } from "@/utils/theme";
import { useEffect } from "react";

export const useSyncTheme = () => {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
};

