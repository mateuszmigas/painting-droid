import type { CanvasLayerId } from "./../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import type { CanvasLayerData } from "../canvasState";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId; data: CanvasLayerData | null }
): CanvasAction => {
  const { layerId, data } = payload;
  const state = context.getState();

  const capturedData = {
    layerId,
    oldData: state.layers.find((layer) => layer.id === layerId)!.data,
    newData: data,
  };

  return {
    display: "Update Layer Data",
    icon: "plus",
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

