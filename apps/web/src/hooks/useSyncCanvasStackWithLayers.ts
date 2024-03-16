import type { CanvasLayer } from "@/canvas/canvasState";
import type { CanvasContext } from "@/utils/common";
import { clearContext, restoreContextFromCompressed } from "@/utils/imageData";
import { type RefObject, useEffect, useState } from "react";

const restoreLayers = async (
  layers: CanvasLayer[],
  contexts: CanvasContext[]
) => {
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const context = contexts[i];

    if (layer.visible && layer.data) {
      await restoreContextFromCompressed(layer.data, context);
    } else {
      clearContext(context);
    }
  }
};

export const useSyncCanvasStackWithLayers = (
  canvasElementsRef: RefObject<HTMLCanvasElement[]>,
  layers: CanvasLayer[]
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
