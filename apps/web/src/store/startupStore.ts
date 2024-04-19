import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createSyncStorage } from "./syncStorage";

type AppStartupStore = {
  desktopVersionAvailableNotified: boolean;
  lastVersion: string;
};

const defaultState: AppStartupStore = {
  desktopVersionAvailableNotified: false,
  lastVersion: "0.0.0",
};

type AppStartupSlice = AppStartupStore & {
  setDesktopVersionAvailableNotified: (notified: boolean) => void;
  setCurrentVersion: (version: string) => void;
};

export const startupStoreCreator: StateCreator<AppStartupSlice> = (set) => ({
  ...defaultState,
  setDesktopVersionAvailableNotified: (notified) =>
    set({ desktopVersionAvailableNotified: notified }),
  setCurrentVersion: (version) => set({ lastVersion: version }),
});

export const useStartupStore = create<AppStartupSlice>()(
  persist(
    startupStoreCreator,
    createSyncStorage({ version: 1, name: "startup" })
  )
);

