import type { IconType } from "@/components/icons/icon";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";
import { ImageProcessor } from "@/utils/imageProcessor";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: {
    display?: string;
    icon?: IconType;
  }
): Promise<CanvasAction> => {
  const { display, icon } = payload;
  const state = context.getState();
  const previousCapturedArea = state.capturedArea;

  const layerData = state.layers[state.activeLayerIndex].data;

  if (!layerData || !state.capturedArea?.captured) {
    throw new Error("No layer data to cut");
  }

  const newLayerData = await ImageProcessor.fromCompressedData(layerData)
    .useContext(async (context) => {
      const { x, y, width, height } = state.capturedArea!.boundingBox;
      context.clearRect(x, y, width, height);
    })
    .toCompressedData();

  const capturedData = {
    previousCapturedArea,
    previousLayerData: layerData,
    newCapturedArea: null,
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

