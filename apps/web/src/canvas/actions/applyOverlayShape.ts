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

  if (!state.overlayShape?.captured) {
    throw new Error("No overlay shape to apply");
  }

  const overlayShape = state.overlayShape;
  const overlayShapeContext = await ImageProcessor.fromCompressedData(
    overlayShape.captured!.data
  ).toContext();

  const layerData = state.layers[state.activeLayerIndex].data;
  const processor =
    layerData === null
      ? ImageProcessor.fromEmpty(size.width, size.height)
      : ImageProcessor.fromCompressedData(layerData);

  const newLayerData = await processor
    .useContext(async (context) => {
      const { x, y, width, height } = overlayShape.boundingBox;
      context.drawImage(overlayShapeContext.canvas, x, y, width, height);
    })
    .toCompressedData();

  const capturedData = {
    previousOverlayShape: overlayShape,
    previousLayerData: layerData,
    newOverlayShape: null,
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
