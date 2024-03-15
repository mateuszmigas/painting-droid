import type { CanvasState } from "../canvasState";

export type CanvasActionContext = {
  getState: () => CanvasState;
};

