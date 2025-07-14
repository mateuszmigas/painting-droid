import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createSyncStorage } from "./syncStorage";

type AppStartupStore = {
  welcomeDialogShown: boolean;
  lastVersion: string;
};

const defaultState: AppStartupStore = {
  welcomeDialogShown: false,
  lastVersion: "0.0.0",
};

type AppStartupSlice = AppStartupStore & {
  setWelcomeDialogShown: (notified: boolean) => void;
  setCurrentVersion: (version: string) => void;
};

export const startupStoreCreator: StateCreator<AppStartupSlice> = (set) => ({
  ...defaultState,
  setWelcomeDialogShown: (notified) => set({ welcomeDialogShown: notified }),
  setCurrentVersion: (version) => set({ lastVersion: version }),
});

export const useStartupStore = create<AppStartupSlice>()(
  persist(startupStoreCreator, createSyncStorage({ version: 2, name: "startup" })),
);
