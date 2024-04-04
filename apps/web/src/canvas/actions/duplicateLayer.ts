import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { uuid } from "@/utils/uuid";
import type { CanvasLayerId } from "../canvasState";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): Promise<CanvasAction> => {
  const { layerId } = payload;
  const state = context.getState();

  const capturedData = {
    sourceLayerId: layerId,
    targetLayerId: uuid(),
  };

  return {
    display: translations.canvasActions.duplicateLayer,
    icon: "copy",
    execute: async (state) => {
      const index = state.layers.findIndex(
        (layer) => layer.id === capturedData.sourceLayerId
      );
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, index + 1),
          {
            ...state.layers[index],
            id: capturedData.targetLayerId,
            name: translations.layers.defaultCopyName(state.layers[index].name),
          },
          ...state.layers.slice(index + 1),
        ],
        activeLayerIndex: index + 1,
      };
    },
    undo: async () => {
      return {
        ...state,
        layers: state.layers.filter(
          (layer) => layer.id !== capturedData.targetLayerId
        ),
      };
    },
  };
};
