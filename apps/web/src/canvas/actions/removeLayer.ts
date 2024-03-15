import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import type { CanvasLayerId } from "../canvasState";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): CanvasAction => {
  const { layerId } = payload;
  const state = context.getState();

  if (state.layers.length === 1) {
    throw new Error("Cannot remove the last layer");
  }

  const removedLayerIndex = state.layers.findIndex(
    (layer) => layer.id === layerId
  );

  const capturedData = {
    index: removedLayerIndex,
    layer: state.layers[removedLayerIndex],
    activeLayerIndex: state.activeLayerIndex,
  };

  return {
    display: "Remove Layer",
    icon: "plus",
    execute: async (canvas) => {
      return {
        ...canvas,
        layers: canvas.layers.filter(
          (layer) => layer.id !== capturedData.layer.id
        ),
        activeLayerIndex:
          capturedData.index === canvas.activeLayerIndex
            ? Math.max(capturedData.index - 1, 0)
            : canvas.activeLayerIndex,
      };
    },
    undo: async () => {
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, capturedData.index),
          capturedData.layer,
          ...state.layers.slice(capturedData.index),
        ],
        activeLayerIndex: capturedData.activeLayerIndex,
      };
    },
  };
};

