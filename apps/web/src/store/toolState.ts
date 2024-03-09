import { defaultToolsSettings, ToolId } from "@/tools";
import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppToolState = {
  selectedToolId: ToolId;
  toolSettings: Record<ToolId, Record<string, unknown>>;
};

const defaultState: AppToolState = {
  selectedToolId: "brush",
  toolSettings: defaultToolsSettings,
};

type AppToolSlice = AppToolState & {
  setSelectedToolId: (type: ToolId) => void;
  updateToolSettings: (
    toolId: ToolId,
    settings: Record<string, unknown>
  ) => void;
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
  persist(settingsStoreCreator, {
    version: 2,
    name: "tool",
    storage: createJSONStorage(() => sessionStorage),
  })
);

