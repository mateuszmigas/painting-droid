import { defaultLayer } from "./../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { uuid } from "@/utils/uuid";
import type { CanvasLayerData } from "../canvasState";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: { data?: CanvasLayerData }
): CanvasAction => {
  const { data } = payload;
  const state = context.getState();

  const capturedData = {
    id: uuid(),
    name: translations.layers.defaultNewName(state.layers.length + 1),
    activeLayerIndex: state.activeLayerIndex,
  };

  return {
    display: translations.canvasActions.addLayer,
    icon: "plus",
    execute: async (state) => {
      return {
        ...state,
        layers: [
          ...state.layers,
          {
            ...defaultLayer,
            id: capturedData.id,
            name: capturedData.name,
            data: data || null,
          },
        ],
        activeLayerIndex: state.layers.length,
      };
    },
    undo: async () => {
      return {
        ...state,
        layers: state.layers.filter((layer) => layer.id !== capturedData.id),
        activeLayerIndex: capturedData.activeLayerIndex,
      };
    },
  };
};
