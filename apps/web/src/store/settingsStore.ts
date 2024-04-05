import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createSyncStorage } from "./syncStorage";

type ThemeType = "light" | "dark" | "system";

type AppSettingsState = {
  theme: ThemeType;
};

const defaultState: AppSettingsState = {
  theme: "system",
};

type AppSettingsSlice = AppSettingsState & {
  setTheme: (theme: ThemeType) => void;
};

export const settingsStoreCreator: StateCreator<AppSettingsSlice> = (set) => ({
  ...defaultState,
  setTheme: (theme) => set({ theme }),
});

export const useSettingsStore = create<AppSettingsSlice>()(
  persist(
    settingsStoreCreator,
    createSyncStorage({ version: 2, name: "settings" })
  )
);
