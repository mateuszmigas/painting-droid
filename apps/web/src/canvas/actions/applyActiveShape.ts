import { getTranslations } from "@/translations";
import { ImageProcessor } from "@/utils/imageProcessor";
import { spreadOmitKeys } from "@/utils/object";
import { rasterizeShape } from "@/utils/shapeRasterizer";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

const translations = getTranslations();

export const createCanvasAction = async (context: CanvasActionContext): Promise<CanvasAction> => {
  const state = context.getState();
  const { size } = state;

  if (!state.activeShapeId) {
    throw new Error("No active shape");
  }

  const activeShape = state.shapes[state.activeShapeId];
  const layerData = state.layers[state.activeLayerIndex].data;

  const imageProcessor =
    layerData === null
      ? ImageProcessor.fromEmpty(size.width, size.height)
      : ImageProcessor.fromCompressedData(layerData);

  const newLayerData = await imageProcessor
    .useContext((context) => rasterizeShape(context, activeShape))
    .toCompressedData();

  const capturedData = {
    previousActiveShapeId: state.activeShapeId,
    previousActiveShape: activeShape,
    previousLayerData: layerData,
    newLayerData,
  };

  return {
    display: translations.shapesTransform[activeShape.type].apply,
    icon: "deselect",
    execute: async (state) => {
      return {
        ...state,
        layers:
          capturedData.previousLayerData !== capturedData.newLayerData
            ? state.layers.map((layer, index) =>
                index === state.activeLayerIndex ? { ...layer, data: capturedData.newLayerData } : layer,
              )
            : state.layers,
        shapes: spreadOmitKeys(state.shapes, [capturedData.previousActiveShapeId]),
        activeShapeId: null,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers:
          capturedData.previousLayerData !== capturedData.newLayerData
            ? state.layers.map((layer, index) =>
                index === state.activeLayerIndex ? { ...layer, data: capturedData.previousLayerData } : layer,
              )
            : state.layers,
        shapes: {
          ...state.shapes,
          [capturedData.previousActiveShapeId]: capturedData.previousActiveShape,
        },
        activeShapeId: capturedData.previousActiveShapeId,
      };
    },
  };
};
