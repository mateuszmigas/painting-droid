import type { IconType } from "@/components/icons/icon";
import type { CanvasState } from "../canvasState";

export type CanvasAction = {
  display: string;
  icon: IconType;
  execute: (state: CanvasState) => Promise<CanvasState>;
  undo: (state: CanvasState) => Promise<CanvasState>;
};
