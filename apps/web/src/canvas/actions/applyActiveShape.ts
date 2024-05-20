import { getTranslations } from "@/translations";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { ImageProcessor } from "@/utils/imageProcessor";
import { spreadOmitKeys } from "@/utils/object";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext
): Promise<CanvasAction> => {
  const state = context.getState();
  const { size } = state;

  if (!state.activeShapeId) {
    throw new Error("No active shape");
  }

  const activeShape = state.shapes[state.activeShapeId];
  const capturedArea = activeShape.capturedArea ?? null;
  const layerData = state.layers[state.activeLayerIndex].data;
  let newLayerData = layerData;

  if (capturedArea) {
    const capturedAreaContext = await ImageProcessor.fromCompressedData(
      capturedArea.data
    ).toContext();

    const processor =
      layerData === null
        ? ImageProcessor.fromEmpty(size.width, size.height)
        : ImageProcessor.fromCompressedData(layerData);

    newLayerData = await processor
      .useContext(async (context) => {
        const { x, y, width, height } = activeShape.boundingBox;
        context.drawImage(capturedAreaContext.canvas, x, y, width, height);
      })
      .toCompressedData();
  }

  const capturedData = {
    previousActiveShapeId: state.activeShapeId,
    previousActiveShape: activeShape,
    previousLayerData: layerData,
    newLayerData,
  };

  return {
    display: translations.canvasActions.applySelection,
    icon: "deselect",
    execute: async (state) => {
      return {
        ...state,
        layers:
          capturedData.previousLayerData !== capturedData.newLayerData
            ? state.layers.map((layer, index) =>
                index === state.activeLayerIndex
                  ? { ...layer, data: capturedData.newLayerData }
                  : layer
              )
            : state.layers,
        shapes: spreadOmitKeys(state.shapes, [
          capturedData.previousActiveShapeId,
        ]),
        activeShapeId: null,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers:
          capturedData.previousLayerData !== capturedData.newLayerData
            ? state.layers.map((layer, index) =>
                index === state.activeLayerIndex
                  ? { ...layer, data: capturedData.previousLayerData }
                  : layer
              )
            : state.layers,
        shapes: {
          ...state.shapes,
          [capturedData.previousActiveShapeId]:
            capturedData.previousActiveShape,
        },
        activeShapeId: capturedData.previousActiveShapeId,
      };
    },
  };
};

