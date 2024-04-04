import {
  type Position,
  type Rectangle,
  type Size,
  scaleRectangleToFitParent,
} from "../common";

export type Viewport = {
  position: Position;
  zoom: number;
};

export const defaultViewport: Viewport = {
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
  const result = scaleRectangleToFitParent(targetArea, windowSize, padding);
  return {
    position: { x: result.x, y: result.y },
    zoom: result.scale,
  };
};

export const calculateMousePosition = (
  viewport: Viewport,
  mousePosition: Position,
  element: HTMLElement
) => {
  const elementRect = element.getBoundingClientRect();
  const position = {
    x: mousePosition.x - elementRect.x,
    y: mousePosition.y - elementRect.y,
  };
  return screenToViewportPosition(position, viewport);
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
