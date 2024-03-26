import { setActiveCanvasContext } from "@/contexts/canvasContextService";
import type { CanvasOverlayShape } from "../canvas/canvasState";
import type { CanvasLayer } from "@/canvas/canvasState";
import type { CanvasContext } from "@/utils/common";
import { clearContext, restoreContextFromCompressed } from "@/utils/imageData";
import { type RefObject, useEffect, useState } from "react";

const restoreLayers = async (
  layers: CanvasLayer[],
  activeLayerIndex: number,
  overlayShape: CanvasOverlayShape | null,
  contexts: CanvasContext[]
) => {
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const context = contexts[i];

    if (layer.visible && layer.data) {
      await restoreContextFromCompressed(layer.data, context);

      if (i === activeLayerIndex && overlayShape?.captured) {
        // const rect = overlayShape.captured.box;
        // context.clearRect(rect.x, rect.y, rect.width, rect.height);
      }
    } else {
      clearContext(context);
    }
  }
};

export const useSyncCanvasWithLayers = (
  canvasElementsRef: RefObject<HTMLCanvasElement[]>,
  layers: CanvasLayer[],
  activeLayerIndex: number,
  overlayShape: CanvasOverlayShape | null
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

    restoreLayers(layers, activeLayerIndex, overlayShape, newContexts).then(
      () => {
        setContexts(newContexts);
        setActiveCanvasContext(newContexts[activeLayerIndex]);
      }
    );
  }, [layers, activeLayerIndex, overlayShape, canvasElementsRef]);

  return { contexts };
};
