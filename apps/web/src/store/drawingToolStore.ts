import { DrawingToolType } from "@/drawing-tools";
import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppDrawingToolState = {
  selectedTool: DrawingToolType;
};

const defaultState: AppDrawingToolState = {
  selectedTool: "pen",
};

type AppDrawingToolSlice = AppDrawingToolState & {
  setSelectedTool: (type: DrawingToolType) => void;
};

export const settingsStoreCreator: StateCreator<AppDrawingToolSlice> = (
  set
) => ({
  ...defaultState,
  setSelectedTool: (type: DrawingToolType) => set({ selectedTool: type }),
});

export const useDrawingToolStore = create<AppDrawingToolSlice>()(
  persist(settingsStoreCreator, {
    version: 1,
    name: "drawing-tool",
    storage: createJSONStorage(() => sessionStorage),
  })
);

