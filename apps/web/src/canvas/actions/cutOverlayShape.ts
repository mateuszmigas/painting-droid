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
  const previousOverlayShape = state.overlayShape;

  const layerData = state.layers[state.activeLayerIndex].data;

  if (!layerData || !state.overlayShape?.captured) {
    throw new Error("No layer data to cut");
  }

  const newLayerData = await ImageProcessor.fromCompressedData(layerData)
    .useContext(async (context) => {
      const { x, y, width, height } = state.overlayShape!.boundingBox;
      context.clearRect(x, y, width, height);
    })
    .toCompressedData();

  const capturedData = {
    previousOverlayShape,
    previousLayerData: layerData,
    newOverlayShape: null,
    newLayerData,
  };

  return {
    display: display ?? translations.canvasActions.cutOverlayShape,
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
        overlayShape: capturedData.newOverlayShape,
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
        overlayShape: capturedData.previousOverlayShape,
      };
    },
  };
};

