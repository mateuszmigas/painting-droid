import type { CanvasActionDispatcher } from "@/canvas/canvasActionDispatcher";
import type { CanvasOverlayShape, CanvasLayer } from "@/canvas/canvasState";
import { toolsMetadata } from "@/tools";
import type { DrawToolId } from "@/tools/draw-tools";
import { clearContext, restoreContextFromCompressed } from "@/utils/canvas";
import { type CanvasContext, areRectanglesEqual } from "@/utils/common";
import { ImageProcessor } from "@/utils/imageProcessor";

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
            data: await ImageProcessor.fromCropContext(
              activeContext!,
              box
            ).toCompressedData(),
          },
        },
      });
    },
    cancel: async (shape: CanvasOverlayShape | null) => {
      const apply =
        shape?.captured &&
        !areRectanglesEqual(shape.boundingBox, shape.captured.box);

      if (apply) {
        await canvasActionDispatcher.execute("applyOverlayShape", undefined);
      } else {
        shape &&
          (await canvasActionDispatcher.execute(
            "clearOverlayShape",
            undefined
          ));
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
      const contextData = await ImageProcessor.fromContext(
        activeContext
      ).toCompressed();

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
    },
    cancel: async () => {
      if (!activeContext) return;
      if (activeLayer.data) {
        restoreContextFromCompressed(activeContext, activeLayer.data);
      } else {
        clearContext(activeContext);
      }
    },
  };
};
