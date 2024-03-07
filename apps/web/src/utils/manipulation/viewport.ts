import { Position, Rectangle, Size, scaleRectangle } from "../common";

export type Viewport = {
  size: Size;
  position: Position;
  zoom: number;
};

export const defaultViewport: Viewport = {
  size: { width: 0, height: 0 },
  position: { x: 0, y: 0 },
  zoom: 1,
};

export const zoomAtPosition = (
  currentViewport: Viewport,
  zoom: number,
  position: Position
): Viewport => ({
  ...currentViewport,
  position: {
    x: position.x - (position.x - currentViewport.position.x) * zoom,
    y: position.y - (position.y - currentViewport.position.y) * zoom,
  },
  zoom: currentViewport.zoom * zoom,
});

export const calculateFitViewport = (
  windowSize: Size,
  targetArea: Rectangle,
  padding: number
): Viewport => {
  const windowSizeWithPadding = {
    width: windowSize.width - 2 * padding,
    height: windowSize.height - 2 * padding,
  };
  const targetAreaRatio = targetArea.width / targetArea.height;
  const windowSizeRatio =
    windowSizeWithPadding.width / windowSizeWithPadding.height;
  const alignHorizontally = targetAreaRatio > windowSizeRatio;

  const newZoom = alignHorizontally
    ? windowSizeWithPadding.width / targetArea.width
    : windowSizeWithPadding.width / (targetArea.height * windowSizeRatio);
  const scaledTargetArea = scaleRectangle(targetArea, newZoom);
  const newPosition = alignHorizontally
    ? {
        x: -scaledTargetArea.x,
        y:
          -scaledTargetArea.y +
          (windowSizeWithPadding.height - scaledTargetArea.height) / 2,
      }
    : {
        x:
          -scaledTargetArea.x +
          (windowSizeWithPadding.width - scaledTargetArea.width) / 2,
        y: -scaledTargetArea.y,
      };

  return {
    size: windowSize,
    position: { x: newPosition.x + padding, y: newPosition.y + padding },
    zoom: newZoom,
  };
};

export const screenToViewportPosition = (
  position: Position,
  viewport: Viewport
) => {
  return {
    x: (position.x - viewport.position.x) / viewport.zoom,
    y: (position.y - viewport.position.y) / viewport.zoom,
  };
};

