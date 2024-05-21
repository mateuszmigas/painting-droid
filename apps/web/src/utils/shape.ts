import type { CanvasShape } from "@/canvas/canvasState";
import type { Position, Rectangle, Shape2d } from "@/utils/common";
import { isPositionInRectangle } from "./geometry";
import { domNames } from "@/constants";

export const gripSize = 10;

export type TransformGripId =
  | "grip-top-left"
  | "grip-top-right"
  | "grip-bottom-left"
  | "grip-bottom-right";
export type TransformHandle = TransformGripId | "body";

const generateGrips = (
  boundingBox: Rectangle
): { gripId: TransformGripId; position: Position }[] => {
  const { x, y, width, height } = boundingBox;
  return [
    { gripId: "grip-top-left", position: { x, y } },
    { gripId: "grip-top-right", position: { x: x + width, y } },
    { gripId: "grip-bottom-left", position: { x, y: y + height } },
    { gripId: "grip-bottom-right", position: { x: x + width, y: y + height } },
  ];
};

export const transformBox = (
  handle: TransformHandle,
  boundingBox: Rectangle,
  startPosition: Position,
  endPosition: Position
): Rectangle => {
  if (handle === "body") {
    return {
      x: boundingBox.x + (endPosition.x - startPosition.x),
      y: boundingBox.y + (endPosition.y - startPosition.y),
      width: boundingBox.width,
      height: boundingBox.height,
    };
  }

  if (handle === "grip-top-left") {
    return {
      x: endPosition.x,
      y: endPosition.y,
      width: boundingBox.x + boundingBox.width - endPosition.x,
      height: boundingBox.y + boundingBox.height - endPosition.y,
    };
  }

  return boundingBox;
};

export const getTransformHandle = (
  canvasPosition: Position,
  screenPosition: Position,
  boundingBox: Rectangle
): TransformHandle | null => {
  const svgHostBox = document
    .getElementById(domNames.svgHostId)!
    .getBoundingClientRect();

  const gripElements = document.getElementsByClassName(domNames.svgGripClass);
  const relativeScreenPosition = {
    x: screenPosition.x + svgHostBox.x,
    y: screenPosition.y + svgHostBox.y,
  };

  for (const grip of gripElements) {
    const gripBox = grip.getBoundingClientRect();

    if (isPositionInRectangle(relativeScreenPosition, gripBox)) {
      return grip.getAttribute("data-grip-id") as TransformGripId;
    }
  }

  if (isPositionInRectangle(canvasPosition, boundingBox)) {
    return "body";
  }

  return null;
};

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

    const grips = generateGrips(shape.boundingBox).map(
      (grip) =>
        ({
          type: "selection-grip",
          gripId: grip.gripId,
          position: grip.position,
        } as const)
    );
    result.push(...grips);
  }

  return result;
};

