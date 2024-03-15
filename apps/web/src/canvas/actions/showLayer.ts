import type { CanvasLayerId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): CanvasAction => {
  const { layerId } = payload;
  const state = context.getState();

  const capturedData = { layerId };

  return {
    display: "Show Layer",
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
    undo: async () => {
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

