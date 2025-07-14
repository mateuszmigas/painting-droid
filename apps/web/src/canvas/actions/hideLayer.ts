import { getTranslations } from "@/translations";
import type { CanvasLayerId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

const translations = getTranslations();

export const createCanvasAction = async (
  _: CanvasActionContext,
  payload: { layerId: CanvasLayerId },
): Promise<CanvasAction> => {
  const { layerId } = payload;
  const capturedData = { layerId };

  return {
    display: translations.canvasActions.hideLayer,
    icon: "hidden",
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer) => (layer.id === capturedData.layerId ? { ...layer, visible: false } : layer)),
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer) => (layer.id === capturedData.layerId ? { ...layer, visible: true } : layer)),
      };
    },
  };
};
