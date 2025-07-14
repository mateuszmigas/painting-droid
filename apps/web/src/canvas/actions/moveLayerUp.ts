import { getTranslations } from "@/translations";
import type { CanvasLayerId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId },
): Promise<CanvasAction> => {
  const { layerId } = payload;
  const state = context.getState();

  const currentIndex = state.layers.findIndex((layer) => layer.id === layerId);

  if (currentIndex === state.layers.length - 1) {
    throw new Error("Cannot move layer up");
  }

  const capturedData = { currentIndex };

  return {
    display: translations.canvasActions.moveLayerUp,
    icon: "arrow-down",
    execute: async (state) => {
      const targetIndex = capturedData.currentIndex + 1;
      if (targetIndex >= state.layers.length) return state;
      const layers = [...state.layers];
      const layer = layers[capturedData.currentIndex];
      layers[capturedData.currentIndex] = layers[targetIndex];
      layers[targetIndex] = layer;
      return { ...state, layers, activeLayerIndex: targetIndex };
    },
    undo: async (state) => {
      const targetIndex = capturedData.currentIndex - 1;
      if (targetIndex < 0) return state;
      const layers = [...state.layers];
      const layer = layers[capturedData.currentIndex];
      layers[capturedData.currentIndex] = layers[targetIndex];
      layers[targetIndex] = layer;
      return { ...state, layers, activeLayerIndex: targetIndex };
    },
  };
};
