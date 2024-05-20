import { useCanvasContextStore } from "@/contexts/canvasContextStore";
import { useCanvasActionDispatcher } from "./useCanvasActionDispatcher";
import { useStableCallback } from "./useStableCallback";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { canvasToolsMetadata } from "@/tools";
import type { CanvasToolId } from "@/tools";
import type { CanvasToolResult } from "@/tools/canvasTool";
import { restoreContextFromCompressed } from "@/utils/canvas";
import { ImageProcessor } from "@/utils/imageProcessor";
import { useMemo } from "react";
import type { CanvasShape } from "@/canvas/canvasState";

export const useCanvasToolHandlers = () => {
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const { context } = useCanvasContextStore();
  const { layers, activeLayerIndex, shapes, activeShapeId } =
    useWorkspacesStore(activeWorkspaceCanvasDataSelector);

  const getActiveShape = useStableCallback(() =>
    activeShapeId !== null ? shapes[activeShapeId] : null
  );

  const transformShape = useStableCallback(async (shape: CanvasShape) => {
    await canvasActionDispatcher.execute("transformShape", {
      shapeId: shape.id,
      boundingBox: shape.boundingBox,
    });
  });

  const resolveActiveShape = useStableCallback(async () => {
    if (getActiveShape()) {
      await canvasActionDispatcher.execute("resolveActiveShape", undefined);
    }
  });

  const toolCommit = useStableCallback(
    async (toolId: CanvasToolId, result: CanvasToolResult) => {
      if (!context.bitmap || !context.vector) {
        throw new Error("Canvas context is not initialized");
      }

      const { shape, bitmapContextChanged } = result;

      if (shape) {
        if (shape.capturedArea) {
          shape.capturedArea.data = await ImageProcessor.fromCropContext(
            context.bitmap,
            shape.boundingBox
          ).toCompressedData();
        }
        await canvasActionDispatcher.execute("addShape", { shape });
      }

      if (bitmapContextChanged) {
        const activeLayer = layers[activeLayerIndex];
        const { name, icon } = canvasToolsMetadata[toolId!];
        const { data, width, height } = await ImageProcessor.fromContext(
          context.bitmap
        ).toCompressed();

        const layerData =
          !activeLayer.visible && activeLayer.data
            ? await ImageProcessor.fromMergedCompressed(
                [activeLayer.data, data],
                { width: width, height: height }
              ).toCompressedData()
            : data;

        await canvasActionDispatcher.execute("updateLayerData", {
          layerId: activeLayer.id,
          display: name,
          icon,
          data: layerData,
        });
      }
    }
  );

  const toolDiscard = useStableCallback(async () => {
    if (!context.bitmap || !context.vector) {
      throw new Error("Canvas context is not initialized");
    }

    if (getActiveShape()) {
      await canvasActionDispatcher.execute("clearActiveShape", undefined);
    }

    context.vector.clear("tool");
    restoreContextFromCompressed(context.bitmap, layers[activeLayerIndex].data);
  });

  return useMemo(() => {
    return {
      getActiveShape,
      transformShape,
      resolveActiveShape,
      toolCommit,
      toolDiscard,
    };
  }, [
    getActiveShape,
    transformShape,
    resolveActiveShape,
    toolCommit,
    toolDiscard,
  ]);
};

