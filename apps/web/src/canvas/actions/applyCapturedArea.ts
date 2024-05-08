import { getTranslations } from "@/translations";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { ImageProcessor } from "@/utils/imageProcessor";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext
): Promise<CanvasAction> => {
  const state = context.getState();
  const { size } = state;

  if (!state.capturedArea?.captured) {
    throw new Error("No captured area to apply");
  }

  const capturedArea = state.capturedArea;
  const capturedAreaContext = await ImageProcessor.fromCompressedData(
    capturedArea.captured!.data
  ).toContext();

  const layerData = state.layers[state.activeLayerIndex].data;
  const processor =
    layerData === null
      ? ImageProcessor.fromEmpty(size.width, size.height)
      : ImageProcessor.fromCompressedData(layerData);

  const newLayerData = await processor
    .useContext(async (context) => {
      const { x, y, width, height } = capturedArea.boundingBox;
      context.drawImage(capturedAreaContext.canvas, x, y, width, height);
    })
    .toCompressedData();

  const capturedData = {
    previousCapturedArea: capturedArea,
    previousLayerData: layerData,
    newCapturedArea: null,
    newLayerData,
  };

  return {
    display: translations.canvasActions.applySelection,
    icon: "deselect",
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer, index) => {
          if (index === state.activeLayerIndex) {
            return { ...layer, data: capturedData.newLayerData };
          }
          return layer;
        }),
        capturedArea: capturedData.newCapturedArea,
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
        capturedArea: capturedData.previousCapturedArea,
      };
    },
  };
};

