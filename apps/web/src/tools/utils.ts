import type { CanvasShape } from "@/canvas/canvasState";
import type { Shape2d } from "@/utils/common";

export const canvasShapeToShapes2d = (shape: CanvasShape): Shape2d[] => {
  const result: Shape2d[] = [];

  if (shape.capturedArea) {
    result.push({
      type: "image-rectangle",
      rectangle: shape.boundingBox,
      blob: shape.capturedArea.data,
    });
  }

  if (shape.type === "captured-rectangle") {
    result.push({
      type: "selection-rectangle",
      rectangle: shape.boundingBox,
    });
  }

  return result;
};

