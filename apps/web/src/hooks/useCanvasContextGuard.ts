import type { IconType } from "@/components/icon";
import type { CanvasLayer } from "../canvas/canvasState";
import type { CanvasContext } from "@/utils/common";
import {
  clearContext,
  createCompressedFromContext,
  mergeCompressedData,
  restoreContextFromCompressed,
} from "@/utils/imageData";
import { useMemo } from "react";
import { useCanvasActionDispatcher } from ".";

export type ContextGuard = {
  applyChanges: (name: string, icon: IconType) => void;
  rejectChanges: () => void;
  getContext: () => CanvasContext;
};

export const useCanvasContextGuard = (
  activeContext: CanvasContext,
  activeLayer: CanvasLayer
) => {
  //todo, lock mechanism
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const contextGuard = useMemo<ContextGuard>(() => {
    return {
      applyChanges: async (source: string, icon: IconType) => {
        const contextData = createCompressedFromContext(activeContext);
        const data =
          !activeLayer.visible && activeLayer.data
            ? await mergeCompressedData([activeLayer.data, contextData])
            : contextData;

        canvasActionDispatcher.execute("updateLayerData", {
          layerId: activeLayer.id,
          source,
          icon,
          data,
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
  }, [activeContext, activeLayer, canvasActionDispatcher]);

  return contextGuard;
};
