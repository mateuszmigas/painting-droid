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

  const capturedData = {
    newLayerIndex: state.layers.findIndex((layer) => layer.id === layerId),
    oldLayerIndex: state.activeLayerIndex,
  };

  return {
    display: translations.canvasActions.selectLayer,
    icon: "mouse-pointer-square",
    execute: async (state) => {
      return {
        ...state,
        activeLayerIndex: capturedData.newLayerIndex,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        activeLayerIndex: capturedData.oldLayerIndex,
      };
    },
  };
};
