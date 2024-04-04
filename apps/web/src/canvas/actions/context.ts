import type { Size } from "@/utils/common";
import type { CanvasState } from "../canvasState";

export type CanvasActionContext = {
  getState: () => CanvasState;
  getSize: () => Size;
};
