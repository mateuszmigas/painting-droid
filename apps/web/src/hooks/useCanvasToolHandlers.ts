import { useCanvasContextStore } from "@/contexts/canvasContextStore";
import { useCanvasActionDispatcher } from "./useCanvasActionDispatcher";
import { useStableCallback } from "./useStableCallback";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { toolsMetadata } from "@/tools";
import type { CanvasToolId } from "@/tools/draw-tools";
import type { CanvasToolResult } from "@/tools/draw-tools/canvasTool";
import { restoreContextFromCompressed, clearContext } from "@/utils/canvas";
import { ImageProcessor } from "@/utils/imageProcessor";
import { useMemo } from "react";

export const useToolHandlers = () => {
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const { context } = useCanvasContextStore();
  const { layers, activeLayerIndex, overlayShape } = useWorkspacesStore(
    activeWorkspaceCanvasDataSelector
  );

  const getShape = useStableCallback(() => overlayShape);

  const transform = useStableCallback(
    async (newSelectedShape: CanvasOverlayShape) => {
      await canvasActionDispatcher.execute("transformOverlayShape", {
        overlayShape: newSelectedShape,
      });
    }
  );

  const applyTransform = useStableCallback(async () => {
    if (getShape()) {
      await canvasActionDispatcher.execute("applyOverlayShape", undefined);
    }
  });

  const cancelTransform = useStableCallback(async () => {
    await canvasActionDispatcher.execute("clearOverlayShape", undefined);
  });

  const commitDraw = useStableCallback(
    async (drawToolId: CanvasToolId, result?: CanvasToolResult) => {
      if (!context.bitmap) return;

      if (result?.shape) {
        const shape = result.shape;
        const box = shape.boundingBox;
        await canvasActionDispatcher.execute("drawOverlayShape", {
          overlayShape: {
            ...shape,
            captured: {
              box,
              data: await ImageProcessor.fromCropContext(
                context.bitmap!,
                box
              ).toCompressedData(),
            },
          },
        });
        return;
      }

      const { name, icon } = toolsMetadata[drawToolId!];
      const contextData = await ImageProcessor.fromContext(
        context.bitmap
      ).toCompressed();

      const activeLayer = layers[activeLayerIndex];
      const data =
        !activeLayer.visible && activeLayer.data
          ? await ImageProcessor.fromMergedCompressed(
              [activeLayer.data, contextData.data],
              {
                width: contextData.width,
                height: contextData.height,
              }
            ).toCompressedData()
          : contextData.data;

      canvasActionDispatcher.execute("updateLayerData", {
        layerId: activeLayer.id,
        display: name,
        icon,
        data,
      });
    }
  );
  const cancel = useStableCallback(async () => {
    console.log("cancel");
    if (!context.bitmap || !context.vector) return;

    if (getShape()) {
      await canvasActionDispatcher.execute("clearOverlayShape", undefined);
    }

    context.vector.render(null);

    const activeLayer = layers[activeLayerIndex];

    if (activeLayer.data) {
      restoreContextFromCompressed(context.bitmap, activeLayer.data);
    } else {
      clearContext(context.bitmap);
    }
  });

  return useMemo(() => {
    return {
      transform,
      applyTransform,
      cancelTransform,
      commitDraw,
      cancel,
      getShape,
    };
  }, [
    transform,
    applyTransform,
    cancelTransform,
    commitDraw,
    cancel,
    getShape,
  ]);
};

