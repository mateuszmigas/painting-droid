import type { CanvasState2 } from "../canvasState";

export type CanvasAction = {
  display: string;
  icon: string;
  execute: (state: CanvasState2) => Promise<CanvasState2>;
  undo: (state: CanvasState2) => Promise<CanvasState2>;
};

