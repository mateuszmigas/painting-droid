import type { CanvasShape } from "@/canvas/canvasState";
import type { BoundingBox, Shape2d } from "./common";
import { generateGrips } from "./boundingBoxTransform";
import { normalizeBoundingBox } from "./geometry";

const createGripsShapes = (boundingBox: BoundingBox): Shape2d[] =>
  generateGrips(boundingBox).map((grip) => ({
    type: "selection-grip",
    gripId: grip.gripId,
    position: grip.position,
  }));

const createSelectionShape = (
  boundingBox: BoundingBox,
  actions?: {
    display: string;
    callback: () => void;
  }[]
): Shape2d => ({
  type: "selection-rectangle",
  rectangle: normalizeBoundingBox(boundingBox),
  actions,
});

export const canvasShapeToShapes2d = (
  shape: CanvasShape,
  actionHandlers?: { applyActiveShape: () => void }
): Shape2d[] => {
  const result: Shape2d[] = [];

  if (shape.capturedArea) {
    result.push({
      type: "image-rectangle",
      boundingBox: shape.boundingBox,
      blob: shape.capturedArea.data,
    });
  }

  if (shape.type === "captured-rectangle") {
    result.push(createSelectionShape(shape.boundingBox));
    result.push(...createGripsShapes(shape.boundingBox));
  }

  if (shape.type === "generated-image") {
    result.push(
      createSelectionShape(shape.boundingBox, [
        {
          display: "Apply",
          callback: () => actionHandlers!.applyActiveShape(),
        },
      ])
    );
    result.push(...createGripsShapes(shape.boundingBox));
  }

  if (shape.type === "drawn-rectangle") {
    result.push({
      type: "rectangle",
      rectangle: normalizeBoundingBox(shape.boundingBox),
      fillColor: shape.fill,
      stroke: { color: shape.stroke.color, width: shape.stroke.width },
    });
    result.push(createSelectionShape(shape.boundingBox));
    result.push(...createGripsShapes(shape.boundingBox));
  }

  if (shape.type === "drawn-ellipse") {
    result.push({
      type: "ellipse",
      rectangle: normalizeBoundingBox(shape.boundingBox),
      fillColor: shape.fill,
      stroke: { color: shape.stroke.color, width: shape.stroke.width },
    });
    result.push(createSelectionShape(shape.boundingBox));
    result.push(...createGripsShapes(shape.boundingBox));
  }

  return result;
};

