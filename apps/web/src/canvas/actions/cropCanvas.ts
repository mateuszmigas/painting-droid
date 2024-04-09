import { ImageProcessor } from "@/utils/imageProcessor";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";
import type { Rectangle } from "@/utils/common";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { crop: Rectangle }
): Promise<CanvasAction> => {
  const { crop } = payload;
  const state = context.getState();

  const newLayersData: (Blob | null)[] = [];
  for (const layer of state.layers) {
    if (layer.data === null) {
      newLayersData.push(null);
    } else {
      const newData = await ImageProcessor.fromCompressedData(layer.data)
        .crop(crop)
        .toCompressedData();
      newLayersData.push(newData);
    }
  }

  const capturedData = {
    previousLayersData: state.layers.map((layer) => layer.data),
    previousCanvasSize: state.size,
    newLayersData,
    newCanvasSize: { width: payload.crop.width, height: payload.crop.height },
  };

  return {
    display: translations.canvasActions.cropCanvas,
    icon: "crop",
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
