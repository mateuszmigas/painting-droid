import { canvasActionDispatcher } from "../canvas/canvasActionDispatcher";
import type { CanvasLayer, CanvasLayerData } from "../canvas/canvasState";
import type { CanvasContext } from "@/utils/common";
import {
  clearContext,
  createCompressedFromContext,
  mergeCompressedData,
  restoreContextFromCompressed,
} from "@/utils/imageData";
import { useMemo } from "react";

export type ContextGuard = {
  applyChanges: () => void;
  rejectChanges: () => void;
  getContext: () => CanvasContext;
};

export const useCanvasContextGuard = (
  activeContext: CanvasContext,
  activeLayer: CanvasLayer
) => {
  //todo, lock mechanism
  const contextGuard = useMemo<ContextGuard>(() => {
    return {
      applyChanges: async () => {
        const contextData = createCompressedFromContext(activeContext);
        const data =
          !activeLayer.visible && activeLayer.data
            ? await mergeCompressedData([activeLayer.data, contextData])
            : contextData;

        canvasActionDispatcher.execute("updateLayerData", {
          layerId: activeLayer.id,
          data: data as CanvasLayerData,
        });
      },
      rejectChanges: async () => {
        if (activeLayer.data) {
          restoreContextFromCompressed(activeLayer.data, activeContext);
        } else {
          clearContext(activeContext);
        }
      },
      getContext: () => activeContext,
    };
  }, [activeContext, activeLayer]);

  return contextGuard;
};
