import type { IconType } from "@/components/icons/icon";
import type { CanvasLayerData, CanvasLayerId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: {
    layerId: CanvasLayerId;
    display: string;
    icon: IconType;
    data: CanvasLayerData;
  },
): Promise<CanvasAction> => {
  const { layerId, display: source, icon, data } = payload;
  const state = context.getState();

  const capturedData = {
    layerId,
    oldData: state.layers.find((layer) => layer.id === layerId)!.data,
    newData: data,
  };

  return {
    display: source,
    icon,
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer) => {
          if (layer.id === capturedData.layerId) {
            return { ...layer, data: capturedData.newData };
          }
          return layer;
        }),
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer) => {
          if (layer.id === capturedData.layerId) {
            return { ...layer, data: capturedData.oldData };
          }
          return layer;
        }),
      };
    },
  };
};
