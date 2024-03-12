import type { Layer, LayerChange } from "@/store/workspacesStore";
import type { CanvasContext } from "@/utils/common";
import {
  clearContext,
  createCompressedFromContext,
  mergeCompressedData,
  restoreContextFromCompressed,
} from "@/utils/imageData";
import { useMemo } from "react";
import { useStableCallback } from ".";

export type ContextDispatcher = {
  applyChanges: () => void;
  rejectChanges: () => void;
  getContext: () => CanvasContext;
};

export const useCanvasContextDispatcher = (
  activeContext: CanvasContext,
  activeLayer: Layer,
  onLayerChange: (change: LayerChange) => void
) => {
  const onLayerChangeStable = useStableCallback(onLayerChange);

  const dispatcher = useMemo<ContextDispatcher>(() => {
    return {
      applyChanges: async () => {
        const contextData = createCompressedFromContext(activeContext);
        const data =
          !activeLayer.visible && activeLayer.compressedData
            ? await mergeCompressedData([
                activeLayer.compressedData,
                contextData,
              ])
            : contextData;

        onLayerChangeStable({
          type: "updateLayer",
          id: activeLayer.id,
          data,
        });
      },
      rejectChanges: async () => {
        const compressedData = activeLayer.compressedData;
        if (compressedData) {
          restoreContextFromCompressed(compressedData, activeContext);
        } else {
          clearContext(activeContext);
        }
      },
      getContext: () => activeContext,
    };
  }, [activeContext, activeLayer, onLayerChangeStable]);

  return dispatcher;
};
