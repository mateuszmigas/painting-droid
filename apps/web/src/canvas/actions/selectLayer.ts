import type { CanvasLayerId } from "./../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): CanvasAction => {
  const { layerId } = payload;
  const state = context.getState();

  const capturedData = {
    newLayerIndex: state.layers.findIndex((layer) => layer.id === layerId),
    oldLayerIndex: state.activeLayerIndex,
  };

  return {
    display: "Select Layer",
    icon: "mouse-pointer-square",
    execute: async (state) => {
      return {
        ...state,
        activeLayerIndex: capturedData.newLayerIndex,
      };
    },
    undo: async () => {
      return {
        ...state,
        activeLayerIndex: capturedData.oldLayerIndex,
      };
    },
  };
};

