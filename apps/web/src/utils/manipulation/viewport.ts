import { Position } from "../common";

export type Viewport = {
  position: Position;
  zoom: number;
};

export const zoomAtPosition = (
  currentViewport: Viewport,
  zoom: number,
  position: Position
): Viewport => ({
  position: {
    x: position.x - (position.x - currentViewport.position.x) * zoom,
    y: position.y - (position.y - currentViewport.position.y) * zoom,
  },
  zoom: currentViewport.zoom * zoom,
});
