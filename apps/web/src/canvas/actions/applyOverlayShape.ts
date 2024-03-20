import type { ImageCompressedData } from "@/utils/imageData";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: {
    activeLayerData: ImageCompressedData | null;
  }
): CanvasAction => {
  const state = context.getState();

  const capturedData = {
    previousOverlayShape: state.overlayShape,
    previousLayerData: state.layers[state.activeLayerIndex].data,
    newOverlayShape: null,
    newLayerData: payload.activeLayerData,
  };

  return {
    display: "Apply Selection",
    icon: "deselect",
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer, index) => {
          if (index === state.activeLayerIndex) {
            return { ...layer, data: payload.activeLayerData };
          }
          return layer;
        }),
        overlayShape: capturedData.newOverlayShape,
      };
    },
    undo: async () => {
      return {
        ...state,
        layers: state.layers.map((layer, index) => {
          if (index === state.activeLayerIndex) {
            return { ...layer, data: capturedData.previousLayerData };
          }
          return layer;
        }),
        overlayShape: capturedData.previousOverlayShape,
      };
    },
  };
};

