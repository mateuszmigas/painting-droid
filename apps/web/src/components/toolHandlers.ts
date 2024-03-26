import type { CanvasActionDispatcher } from "@/canvas/canvasActionDispatcher";
import type { CanvasOverlayShape, CanvasLayer } from "@/canvas/canvasState";
import { toolsMetadata } from "@/tools";
import type { DrawToolId } from "@/tools/draw-tools";
import { type CanvasContext, areRectanglesEqual } from "@/utils/common";
import {
  getRectangleCompressedFromContext,
  putRectangleCompressedToContext,
  createCompressedFromContext,
  mergeCompressedData,
  restoreContextFromCompressed,
  clearContext,
} from "@/utils/imageData";

export const createShapeToolHandlers = (
  activeContext: CanvasContext | null,
  renderShape: (shape: CanvasOverlayShape | null) => void,
  canvasActionDispatcher: CanvasActionDispatcher
) => {
  return {
    update: async (shape: CanvasOverlayShape | null) => {
      renderShape(shape);
    },
    commit: async (
      shape: CanvasOverlayShape | null,
      operation: "draw" | "transform"
    ) => {
      if (shape === null) {
        await canvasActionDispatcher.execute("clearOverlayShape", undefined);
        return;
      }
      if (operation === "transform") {
        await canvasActionDispatcher.execute("transformOverlayShape", {
          overlayShape: shape,
        });
        return;
      }

      const box = shape.boundingBox;
      await canvasActionDispatcher.execute("drawOverlayShape", {
        overlayShape: {
          ...shape,
          captured: {
            box,
            data: await getRectangleCompressedFromContext(activeContext!, box),
          },
        },
      });
    },
    cancel: async (shape: CanvasOverlayShape | null) => {
      const apply =
        shape?.captured &&
        !areRectanglesEqual(shape.boundingBox, shape.captured.box);

      if (apply) {
        await putRectangleCompressedToContext(
          activeContext!,
          shape.captured!.data,
          shape.boundingBox
        );
        canvasActionDispatcher.execute("applyOverlayShape", {
          activeLayerData: createCompressedFromContext(activeContext!),
        });
      } else {
        shape && canvasActionDispatcher.execute("clearOverlayShape", undefined);
      }
    },
  };
};

export const createDrawToolHandlers = (
  activeContext: CanvasContext | null,
  activeLayer: CanvasLayer,
  canvasActionDispatcher: CanvasActionDispatcher
) => {
  return {
    commit: async (drawToolId: DrawToolId) => {
      if (!activeContext) return;

      const { name, icon } = toolsMetadata[drawToolId!];
      const contextData = createCompressedFromContext(activeContext);
      const data =
        !activeLayer.visible && activeLayer.data
          ? await mergeCompressedData([activeLayer.data, contextData])
          : contextData;

      canvasActionDispatcher.execute("updateLayerData", {
        layerId: activeLayer.id,
        source: name,
        icon,
        data,
      });
    },
    cancel: async () => {
      if (!activeContext) return;
      if (activeLayer.data) {
        restoreContextFromCompressed(activeLayer.data, activeContext);
      } else {
        clearContext(activeContext);
      }
    },
  };
};

