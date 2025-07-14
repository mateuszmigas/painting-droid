import type { IconType } from "@/components/icons/icon";
import { getTranslations } from "@/translations";
import { ImageProcessor } from "@/utils/imageProcessor";
import { spreadOmitKeys } from "@/utils/object";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: {
    display?: string;
    icon?: IconType;
  },
): Promise<CanvasAction> => {
  const { display, icon } = payload;
  const state = context.getState();

  if (!state.activeShapeId) {
    throw new Error("No active shape");
  }

  const layerData = state.layers[state.activeLayerIndex].data;
  const activeShape = state.shapes[state.activeShapeId];

  if (!layerData || !activeShape.capturedArea) {
    throw new Error("No layer data to cut");
  }

  const newLayerData = await ImageProcessor.fromCompressedData(layerData)
    .useContext(async (context) => {
      const { x, y, width, height } = activeShape.boundingBox;
      context.clearRect(x, y, width, height);
    })
    .toCompressedData();

  const capturedData = {
    previousActiveShape: activeShape,
    previousActiveShapeId: state.activeShapeId,
    previousLayerData: layerData,
    newLayerData,
  };

  return {
    display: display ?? translations.canvasActions.cutCapturedArea,
    icon: icon ?? "clipboard-cut",
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer, index) => {
          if (index === state.activeLayerIndex) {
            return { ...layer, data: capturedData.newLayerData };
          }
          return layer;
        }),
        shapes: spreadOmitKeys(state.shapes, [capturedData.previousActiveShapeId]),
        activeShapeId: null,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer, index) => {
          if (index === state.activeLayerIndex) {
            return { ...layer, data: capturedData.previousLayerData };
          }
          return layer;
        }),
        shapes: {
          ...state.shapes,
          [capturedData.previousActiveShapeId]: capturedData.previousActiveShape,
        },
        activeShapeId: capturedData.previousActiveShapeId,
      };
    },
  };
};
