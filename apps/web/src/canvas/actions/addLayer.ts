import { getTranslations } from "@/translations";
import { createDefaultLayer } from "./../canvasState";
import type { CanvasLayerData, CanvasLayerId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { id: CanvasLayerId; data?: CanvasLayerData; name?: string },
): Promise<CanvasAction> => {
  const { id, data, name } = payload;
  const state = context.getState();

  const capturedData = {
    newLayer: {
      ...createDefaultLayer(),
      id,
      name: name || translations.layers.defaultNewName(state.layers.length + 1),
      data: data || null,
    },
    previousLayerIndex: state.activeLayerIndex,
  };

  return {
    display: translations.canvasActions.addLayer,
    icon: "plus",
    execute: async (state) => {
      return {
        ...state,
        layers: [...state.layers, capturedData.newLayer],
        activeLayerIndex: state.layers.length,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers: state.layers.filter((layer) => layer.id !== capturedData.newLayer.id),
        activeLayerIndex: capturedData.previousLayerIndex,
      };
    },
  };
};
