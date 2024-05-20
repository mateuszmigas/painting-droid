import type { Position, Rectangle, Size } from "./common";

export const isPositionInRectangle = (
  position: Position,
  rectangle: Rectangle
) =>
  position.x >= rectangle.x &&
  position.x <= rectangle.x + rectangle.width &&
  position.y >= rectangle.y &&
  position.y <= rectangle.y + rectangle.height;

export const distanceBetweenPoints = (point1: Position, point2: Position) =>
  Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);

export const areRectanglesEqual = (
  rectangle1: Rectangle,
  rectangle2: Rectangle
) =>
  rectangle1.x === rectangle2.x &&
  rectangle1.y === rectangle2.y &&
  rectangle1.width === rectangle2.width &&
  rectangle1.height === rectangle2.height;

export const arePointsClose = (
  point1: Position,
  point2: Position,
  threshold = 0
) =>
  Math.abs(point1.x - point2.x) < threshold &&
  Math.abs(point1.y - point2.y) < threshold;

export const scaleRectangle = (
  rectangle: Rectangle,
  scale: number
): Rectangle => ({
  x: rectangle.x * scale,
  y: rectangle.y * scale,
  width: rectangle.width * scale,
  height: rectangle.height * scale,
});

export const scaleRectangleToFitParent = (
  rectangle: Rectangle,
  parent: Size,
  padding = 0
) => {
  const parentWithoutPadding = {
    width: parent.width - 2 * padding,
    height: parent.height - 2 * padding,
  };
  const rectangleRatio = rectangle.width / rectangle.height;
  const parentRatio = parentWithoutPadding.width / parentWithoutPadding.height;
  const alignHorizontally = rectangleRatio > parentRatio;
  const newScale = alignHorizontally
    ? parentWithoutPadding.width / rectangle.width
    : parentWithoutPadding.width / (rectangle.height * parentRatio);
  const scaledRectangle = scaleRectangle(rectangle, newScale);
  const newPosition = alignHorizontally
    ? {
        x: -scaledRectangle.x,
        y:
          -scaledRectangle.y +
          (parentWithoutPadding.height - scaledRectangle.height) / 2,
      }
    : {
        x:
          -scaledRectangle.x +
          (parentWithoutPadding.width - scaledRectangle.width) / 2,
        y: -scaledRectangle.y,
      };

  return {
    x: newPosition.x + padding,
    y: newPosition.y + padding,
    scale: newScale,
  };
};

export const calculateScaleToFit = (child: Size, parent: Size) => {
  const childRatio = child.width / child.height;
  const parentRatio = parent.width / parent.height;
  return childRatio > parentRatio
    ? child.height / parent.height
    : child.width / parent.width;
};

