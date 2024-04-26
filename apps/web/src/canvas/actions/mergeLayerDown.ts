import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import type { CanvasLayerId } from "../canvasState";
import { getTranslations } from "@/translations";
import { ImageProcessor } from "@/utils/imageProcessor";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): Promise<CanvasAction> => {
  const { layerId } = payload;
  const state = context.getState();

  const sourceLayerIndex = state.layers.findIndex(
    (layer) => layer.id === layerId
  );

  if (sourceLayerIndex === 0) {
    throw new Error("Cannot merge layer down");
  }

  const sourceLayer = state.layers[sourceLayerIndex];
  const targetLayer = state.layers[sourceLayerIndex - 1];

  const mergedLayerData = await ImageProcessor.fromMergedCompressed(
    [targetLayer.data, sourceLayer.data].filter(
      (data) => data !== null
    ) as Blob[],
    state.size
  ).toCompressedData();

  const capturedData = {
    index: sourceLayerIndex,
    sourceLayer,
    targetLayer,
    mergedLayerData,
    activeLayerIndex: state.activeLayerIndex,
  };

  return {
    display: translations.canvasActions.mergeLayerDown,
    icon: "merge",
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers
          .filter((layer) => layer.id !== capturedData.sourceLayer.id)
          .map((layer) =>
            layer.id === capturedData.targetLayer.id
              ? { ...layer, data: capturedData.mergedLayerData }
              : layer
          ),
        activeLayerIndex:
          capturedData.activeLayerIndex === capturedData.index
            ? capturedData.index - 1
            : state.activeLayerIndex,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, capturedData.index),
          capturedData.sourceLayer,
          ...state.layers.slice(capturedData.index),
        ].map((layer) =>
          layer.id === capturedData.targetLayer.id
            ? capturedData.targetLayer
            : layer
        ),
        activeLayerIndex: capturedData.activeLayerIndex,
      };
    },
  };
};

