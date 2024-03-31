import { useCanvasPreviewContextStore } from "@/contexts/canvasPreviewContextStore";
import type { CanvasLayer } from "@/canvas/canvasState";
import type { CanvasContext } from "@/utils/common";
import { type RefObject, useEffect } from "react";
import { clearContext, restoreContextFromCompressed } from "@/utils/canvas";

const restoreLayers = async (
  layers: CanvasLayer[],
  contexts: CanvasContext[]
) => {
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const context = contexts[i];

    if (layer.visible && layer.data) {
      await restoreContextFromCompressed(context, layer.data);

      // if (i === activeLayerIndex && overlayShape?.captured) {
      //   // const rect = overlayShape.captured.box;
      //   // context.clearRect(rect.x, rect.y, rect.width, rect.height);
      // }
    } else {
      clearContext(context);
    }
  }
};

export const useSyncCanvasWithLayers = (
  canvasElementsRef: RefObject<HTMLCanvasElement[]>,
  layers: CanvasLayer[],
  activeLayerIndex: number
) => {
  const { setPreviewContext } = useCanvasPreviewContextStore();
  useEffect(() => {
    if (!canvasElementsRef.current) {
      return;
    }

    const newContexts = canvasElementsRef.current.map(
      (element: HTMLCanvasElement) => element.getContext("2d")!
    );

    restoreLayers(layers, newContexts).then(() =>
      setPreviewContext(newContexts[activeLayerIndex])
    );
  }, [layers, setPreviewContext, activeLayerIndex, canvasElementsRef]);
};
