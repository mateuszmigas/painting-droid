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

  if (state.layers.length === 1) {
    throw new Error("Cannot remove the last layer");
  }

  const removedLayerIndex = state.layers.findIndex((layer) => layer.id === layerId);

  const capturedData = {
    index: removedLayerIndex,
    layer: state.layers[removedLayerIndex],
    activeLayerIndex: state.activeLayerIndex,
  };

  return {
    display: translations.canvasActions.removeLayer,
    icon: "x",
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers.filter((layer) => layer.id !== capturedData.layer.id),
        activeLayerIndex:
          capturedData.index === state.activeLayerIndex ? Math.max(capturedData.index - 1, 0) : state.activeLayerIndex,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, capturedData.index),
          capturedData.layer,
          ...state.layers.slice(capturedData.index),
        ],
        activeLayerIndex: capturedData.activeLayerIndex,
      };
    },
  };
};
