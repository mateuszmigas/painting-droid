import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AppPanelNames =
  | "layers"
  | "tools"
  | "effects"
  | "metadata"
  | "history";

export type AppColumnNames = "left" | "middle" | "right";

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
    layers: { name: "layers", size: 35 },
    tools: { name: "tools", size: 50 },
    effects: { name: "effects", size: 50 },
    metadata: { name: "metadata", size: 20 },
    history: { name: "history", size: 35 },
  },
  columns: {
    left: { size: 20 },
    middle: { size: 60 },
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
  persist(settingsStoreCreator, {
    version: 3,
    name: "layout",
    storage: createJSONStorage(() => localStorage),
  })
);

