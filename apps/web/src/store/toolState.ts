import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { type CanvasToolId, defaultCanvasToolsSettings } from "@/tools";
import { createSyncStorage } from "./syncStorage";

type AppToolState = {
  selectedToolId: CanvasToolId;
  toolSettings: Record<CanvasToolId, Record<string, unknown>>;
};

const defaultState: AppToolState = {
  selectedToolId: "brush",
  toolSettings: defaultCanvasToolsSettings,
};

type AppToolSlice = AppToolState & {
  setSelectedToolId: (type: CanvasToolId) => void;
  updateToolSettings: (toolId: CanvasToolId, settings: Record<string, unknown>) => void;
};

export const settingsStoreCreator: StateCreator<AppToolSlice> = (set) => ({
  ...defaultState,
  setSelectedToolId: (toolId) => set({ selectedToolId: toolId }),
  updateToolSettings: (toolId, settings) =>
    set((state) => ({
      toolSettings: {
        ...state.toolSettings,
        [toolId]: settings,
      },
    })),
});

export const useToolStore = create<AppToolSlice>()(
  persist(settingsStoreCreator, createSyncStorage({ version: 10, name: "tool" })),
);
