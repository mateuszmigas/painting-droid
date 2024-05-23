import { getTranslations } from "@/translations";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { ImageProcessor } from "@/utils/imageProcessor";
import { spreadOmitKeys } from "@/utils/object";
import { drawFlippedImage } from "@/utils/canvas";

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
        drawFlippedImage(
          context,
          activeShape.boundingBox,
          capturedAreaContext.canvas
        );
      })
      .toCompressedData();
  }

  if (activeShape.type === "drawn-rectangle") {
    const processor =
      layerData === null
        ? ImageProcessor.fromEmpty(size.width, size.height)
        : ImageProcessor.fromCompressedData(layerData);

    newLayerData = await processor
      .useContext(async (context) => {
        const { x, y, width, height } = activeShape.boundingBox;
        const { fill, stroke } = activeShape;
        const { color, width: strokeWidth } = stroke;

        context.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
        context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        context.lineWidth = strokeWidth;

        context.fillRect(x, y, width, height);
        context.strokeRect(x, y, width, height);
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

