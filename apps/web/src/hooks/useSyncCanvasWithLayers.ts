import type { Layer } from "@/store/workspacesStore";
import type { CanvasContext } from "@/utils/common";
import { clearContext, restoreContextFromCompressed } from "@/utils/imageData";
import { type RefObject, useState, useEffect } from "react";

const restoreLayers = async (layers: Layer[], contexts: CanvasContext[]) => {
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const context = contexts[i];

    if (layer.visible && layer.compressedData) {
      await restoreContextFromCompressed(layer.compressedData, context);
    } else {
      clearContext(context);
    }
  }
};

export const useSyncCanvasWithLayers = (
  canvasElementsRef: RefObject<HTMLCanvasElement[]>,
  layers: Layer[]
) => {
  const [contexts, setContexts] = useState<CanvasContext[] | null>(null);

  useEffect(() => {
    if (!canvasElementsRef.current) {
      return;
    }

    setContexts(null);

    const newContexts = canvasElementsRef.current.map(
      (element: HTMLCanvasElement) => element.getContext("2d")!
    );

    restoreLayers(layers, newContexts).then(() => {
      setContexts(newContexts);
    });
  }, [layers, canvasElementsRef]);

  return { contexts };
};

