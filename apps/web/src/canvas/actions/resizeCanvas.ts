import { ImageProcessor } from "@/utils/imageProcessor";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";
import type { Size } from "@/utils/common";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { newSize: Size }
): Promise<CanvasAction> => {
  const { newSize } = payload;
  const state = context.getState();

  const newLayersData: (Blob | null)[] = [];
  for (const layer of state.layers) {
    if (layer.data === null) {
      newLayersData.push(null);
    } else {
      const newData = await ImageProcessor.fromCompressedData(layer.data)
        .resize(newSize)
        .toCompressedData();
      newLayersData.push(newData);
    }
  }

  const capturedData = {
    previousLayersData: state.layers.map((layer) => layer.data),
    previousCanvasSize: state.size,
    newLayersData,
    newCanvasSize: newSize,
  };

  return {
    display: translations.canvasActions.resizeCanvas,
    icon: "resize",
    execute: async (state) => {
      return {
        ...state,
        size: capturedData.newCanvasSize,
        layers: state.layers.map((layer, index) => {
          return {
            ...layer,
            data: capturedData.newLayersData[index],
          };
        }),
      };
    },
    undo: async () => {
      return {
        ...state,
        size: capturedData.previousCanvasSize,
        layers: state.layers.map((layer, index) => {
          return {
            ...layer,
            data: capturedData.previousLayersData[index],
          };
        }),
      };
    },
  };
};
