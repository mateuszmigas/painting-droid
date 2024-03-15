import type { IconType } from "@/components/icon";
import type { CanvasState2 } from "../canvasState";

export type CanvasAction = {
  display: string;
  icon: IconType;
  execute: (state: CanvasState2) => Promise<CanvasState2>;
  undo: (state: CanvasState2) => Promise<CanvasState2>;
};

