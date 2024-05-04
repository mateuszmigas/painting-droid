import { useCanvasContextStore } from "@/contexts/canvasContextStore";
import { useCanvasActionDispatcher } from "./useCanvasActionDispatcher";
import { useStableCallback } from "./useStableCallback";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { canvasToolsMetadata } from "@/tools";
import type { CanvasToolId } from "@/tools";
import type { CanvasToolResult } from "@/tools/canvasTool";
import { restoreContextFromCompressed, clearContext } from "@/utils/canvas";
import { ImageProcessor } from "@/utils/imageProcessor";
import { useMemo } from "react";
import { areRectanglesEqual } from "@/utils/geometry";

export const useCanvasToolHandlers = () => {
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const { context } = useCanvasContextStore();
  const { layers, activeLayerIndex, overlayShape } = useWorkspacesStore(
    activeWorkspaceCanvasDataSelector
  );

  const getSelectedShape = useStableCallback(() => overlayShape);

  const transformSelectedShape = useStableCallback(
    async (shape: CanvasOverlayShape) => {
      await canvasActionDispatcher.execute("transformOverlayShape", {
        overlayShape: shape,
      });
    }
  );

  const applyOrClearSelectedShape = useStableCallback(async () => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const clearShape =
      selectedShape.captured &&
      areRectanglesEqual(selectedShape.boundingBox, selectedShape.captured.box);

    if (clearShape) {
      await canvasActionDispatcher.execute("clearOverlayShape", undefined);
    } else {
      await canvasActionDispatcher.execute("applyOverlayShape", undefined);
    }
  });

  const drawSelectedShape = useStableCallback(
    async (shape: CanvasOverlayShape) => {
      context.vector?.render(shape);
    }
  );

  const toolCommit = useStableCallback(
    async (toolId: CanvasToolId, result?: CanvasToolResult) => {
      if (!context.bitmap) return;

      //todo: merge updateLayerData with drawOverlayShape
      if (result?.shape) {
        const shape = result.shape;
        const box = shape.boundingBox;
        await canvasActionDispatcher.execute("drawOverlayShape", {
          overlayShape: {
            ...shape,
            captured: {
              box,
              data: await ImageProcessor.fromCropContext(
                context.bitmap,
                box
              ).toCompressedData(),
            },
          },
        });
        return;
      }

      const { name, icon } = canvasToolsMetadata[toolId!];
      const contextData = await ImageProcessor.fromContext(
        context.bitmap
      ).toCompressed();

      const activeLayer = layers[activeLayerIndex];
      const data =
        !activeLayer.visible && activeLayer.data
          ? await ImageProcessor.fromMergedCompressed(
              [activeLayer.data, contextData.data],
              { width: contextData.width, height: contextData.height }
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
  const toolDiscard = useStableCallback(async () => {
    if (getSelectedShape()) {
      await canvasActionDispatcher.execute("clearOverlayShape", undefined);
    }

    if (context.vector) {
      context.vector.render(null);
    }

    if (context.bitmap) {
      const activeLayer = layers[activeLayerIndex];
      if (activeLayer.data) {
        restoreContextFromCompressed(context.bitmap, activeLayer.data);
      } else {
        clearContext(context.bitmap);
      }
    }
  });

  return useMemo(() => {
    return {
      getSelectedShape,
      transformSelectedShape,
      applyOrClearSelectedShape,
      drawSelectedShape,
      toolCommit: toolCommit,
      cancel: toolDiscard,
    };
  }, [
    getSelectedShape,
    drawSelectedShape,
    transformSelectedShape,
    applyOrClearSelectedShape,
    toolCommit,
    toolDiscard,
  ]);
};

