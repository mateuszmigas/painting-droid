import type { CanvasActionDispatcher } from "@/canvas/canvasActionDispatcher";
import type { CanvasOverlayShape, CanvasLayer } from "@/canvas/canvasState";
import { toolsMetadata } from "@/tools";
import type { DrawToolId } from "@/tools/draw-tools";
import { DrawToolResult } from "@/tools/draw-tools/drawTool";
import { clearContext, restoreContextFromCompressed } from "@/utils/canvas";
import {
  type CanvasRasterContext,
  areRectanglesEqual,
  CanvasVectorContext,
} from "@/utils/common";
import { ImageProcessor } from "@/utils/imageProcessor";

// export const createShapeToolHandlers = (
//   activeContext: CanvasRasterContext | null,
//   renderShape: (shape: CanvasOverlayShape | null) => void,
//   canvasActionDispatcher: CanvasActionDispatcher
// ) => {
//   return {
//     commit: async (
//       shape: CanvasOverlayShape | null,
//       operation: "draw" | "transform"
//     ) => {
//       if (shape === null) {
//         await canvasActionDispatcher.execute("clearOverlayShape", undefined);
//         return;
//       }
//       if (operation === "transform") {
//         await canvasActionDispatcher.execute("transformOverlayShape", {
//           overlayShape: shape,
//         });
//         return;
//       }

//       const box = shape.boundingBox;
//       await canvasActionDispatcher.execute("drawOverlayShape", {
//         overlayShape: {
//           ...shape,
//           captured: {
//             box,
//             data: await ImageProcessor.fromCropContext(
//               activeContext!,
//               box
//             ).toCompressedData(),
//           },
//         },
//       });
//     },
//     cancel: async (shape: CanvasOverlayShape | null) => {
//       const apply =
//         shape?.captured &&
//         !areRectanglesEqual(shape.boundingBox, shape.captured.box);

//       if (apply) {
//         await canvasActionDispatcher.execute("applyOverlayShape", undefined);
//       } else {
//         shape &&
//           (await canvasActionDispatcher.execute(
//             "clearOverlayShape",
//             undefined
//           ));
//       }
//     },
//   };
// };

export const createDrawToolHandlers = (
  canvasRasterContext: CanvasRasterContext | null,
  canvasVectorContext: CanvasVectorContext | null,
  activeLayer: CanvasLayer,
  canvasActionDispatcher: CanvasActionDispatcher
) => {
  return {
    commitTransform: async (shape: CanvasOverlayShape | null) => {
      if (shape === null) {
        await canvasActionDispatcher.execute("clearOverlayShape", undefined);
        return;
      }
      await canvasActionDispatcher.execute("transformOverlayShape", {
        overlayShape: shape,
      });
    },
    commitDraw: async (drawToolId: DrawToolId, result?: DrawToolResult) => {
      if (!canvasRasterContext) return;

      if (result?.shape) {
        const shape = result.shape;
        const box = shape.boundingBox;
        await canvasActionDispatcher.execute("drawOverlayShape", {
          overlayShape: {
            ...shape,
            captured: {
              box,
              data: await ImageProcessor.fromCropContext(
                canvasRasterContext!,
                box
              ).toCompressedData(),
            },
          },
        });
        return;
      }

      const { name, icon } = toolsMetadata[drawToolId!];
      const contextData = await ImageProcessor.fromContext(
        canvasRasterContext
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
      console.log("cancel");
      if (!canvasRasterContext || !canvasVectorContext) return;

      canvasVectorContext.render(null);

      //todo deselect

      if (activeLayer.data) {
        restoreContextFromCompressed(canvasRasterContext, activeLayer.data);
      } else {
        clearContext(canvasRasterContext);
      }
    },
  };
};

