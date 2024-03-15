import type { IconType } from "@/components/icon";
import type { CanvasLayerId } from "./../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import type { CanvasLayerData } from "../canvasState";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: {
    layerId: CanvasLayerId;
    source: string;
    icon: IconType;
    data: CanvasLayerData | null;
  }
): CanvasAction => {
  const { layerId, source, icon, data } = payload;
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
    undo: async () => {
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

