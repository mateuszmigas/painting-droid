import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createSyncStorage } from "./syncStorage";

export type AppPanelNames = "layers" | "metadata" | "history";

export type AppColumnNames = "middle" | "right";

type AppPanelState = {
  name: AppPanelNames;
  size: number;
};

type AppLayoutState = {
  panels: Record<AppPanelNames, AppPanelState>;
  columns: Record<AppColumnNames, { size: number }>;
};

const defaultState: AppLayoutState = {
  panels: {
    layers: { name: "layers", size: 40 },
    metadata: { name: "metadata", size: 20 },
    history: { name: "history", size: 40 },
  },
  columns: {
    middle: { size: 80 },
    right: { size: 20 },
  },
};

type AppLayoutSlice = AppLayoutState & {
  setPanelSize: (name: AppPanelNames, size: number) => void;
  setColumnSize: (column: AppColumnNames, size: number) => void;
  resetLayout: () => void;
};

export const settingsStoreCreator: StateCreator<AppLayoutSlice> = (set) => ({
  ...defaultState,
  setPanelSize: (name, size) => {
    set((state) => ({
      panels: {
        ...state.panels,
        [name]: { ...state.panels[name], size },
      },
    }));
  },
  setColumnSize: (column, size) => {
    set((state) => ({
      columns: {
        ...state.columns,
        [column]: { size },
      },
    }));
  },
  resetLayout: () => {
    set(defaultState);
  },
});

export const useLayoutStore = create<AppLayoutSlice>()(
  persist(settingsStoreCreator, createSyncStorage({ version: 3, name: "layout" })),
);
