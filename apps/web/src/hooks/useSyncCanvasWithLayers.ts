import { useCanvasPreviewContextStore } from "@/contexts/canvasPreviewContextStore";
import type { CanvasLayer, CanvasOverlayShape } from "@/canvas/canvasState";
import type { CanvasContext } from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { clearContext } from "@/utils/canvas";
import { features } from "@/contants";

const blobsCache = new Map<string, Blob | undefined | null>();

const restoreLayers = async (
  contextStack: CanvasContext[],
  overlayContext: CanvasContext | null,
  layers: CanvasLayer[],
  overlayShape: CanvasOverlayShape | null
) => {
  //run all operations together to avoid flickering
  const canvasOperations: (() => void)[] = [];

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const context = contextStack[i];

    const previousData = blobsCache.get(layer.id);
    if (previousData !== layer.data?.data) {
      if (layer.visible && layer.data) {
        const { width, height } = layer.data;
        const image = await createImageBitmap(layer.data.data);
        canvasOperations.push(() => {
          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
        });
      } else {
        canvasOperations.push(() => clearContext(context));
      }
    }
    blobsCache.set(layer.id, layer.data?.data);
  }

  if (overlayShape !== null) {
    const { width, height } = overlayShape.captured!.data;
    const image = await createImageBitmap(overlayShape.captured!.data.data);
    canvasOperations.push(() => {
      overlayContext!.canvas.width = width;
      overlayContext!.canvas.height = height;
      overlayContext!.clearRect(0, 0, width, height);
      overlayContext!.drawImage(image, 0, 0, width, height);
    });
  } else {
    canvasOperations.push(() => clearContext(overlayContext!));
  }

  canvasOperations.forEach((operation) => operation());
};

export const useSyncCanvasWithLayers = (
  canvasStackRef: RefObject<HTMLCanvasElement[]>,
  canvasOverlayRef: RefObject<HTMLCanvasElement>,
  layers: CanvasLayer[],
  activeLayerIndex: number,
  overlayShape: CanvasOverlayShape | null
) => {
  const contextsMap = useRef(new WeakMap<HTMLCanvasElement, CanvasContext>());
  const { setPreviewContext } = useCanvasPreviewContextStore();

  useEffect(() => {
    if (!canvasStackRef.current) {
      return;
    }

    const stackContexts = canvasStackRef.current.map(
      (element: HTMLCanvasElement) => {
        if (!contextsMap.current.has(element)) {
          contextsMap.current.set(
            element,
            features.offscreenCanvas
              ? element.transferControlToOffscreen().getContext("2d")!
              : element.getContext("2d")!
          );
        }
        return contextsMap.current.get(element)!;
      }
    );

    if (!contextsMap.current.has(canvasOverlayRef.current!)) {
      contextsMap.current.set(
        canvasOverlayRef.current!,
        canvasOverlayRef.current!.getContext("2d")!
      );
    }
    const overlayContext =
      contextsMap.current.get(canvasOverlayRef.current!) ?? null;

    restoreLayers(stackContexts, overlayContext, layers, overlayShape).then(
      () => setPreviewContext(stackContexts[activeLayerIndex])
    );
  }, [
    setPreviewContext,
    layers,
    activeLayerIndex,
    overlayShape,
    canvasStackRef,
    canvasOverlayRef,
  ]);
};
