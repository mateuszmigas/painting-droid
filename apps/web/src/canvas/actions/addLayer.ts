import { createDefaultLayer } from "./../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { uuid } from "@/utils/uuid";
import type { CanvasLayerData } from "../canvasState";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { data?: CanvasLayerData }
): Promise<CanvasAction> => {
  const { data } = payload;
  const state = context.getState();

  const capturedData = {
    newLayer: {
      ...createDefaultLayer(),
      id: uuid(),
      name: translations.layers.defaultNewName(state.layers.length + 1),
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
        layers: state.layers.filter(
          (layer) => layer.id !== capturedData.newLayer.id
        ),
        activeLayerIndex: capturedData.previousLayerIndex,
      };
    },
  };
};
