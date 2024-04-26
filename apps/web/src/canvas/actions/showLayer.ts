import type { CanvasLayerId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = async (
  _: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): Promise<CanvasAction> => {
  const { layerId } = payload;
  const capturedData = { layerId };

  return {
    display: translations.canvasActions.showLayer,
    icon: "visible",
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer) =>
          layer.id === capturedData.layerId
            ? { ...layer, visible: true }
            : layer
        ),
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer) =>
          layer.id === capturedData.layerId
            ? { ...layer, visible: false }
            : layer
        ),
      };
    },
  };
};

