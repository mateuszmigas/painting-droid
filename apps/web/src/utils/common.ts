import type { CanvasOverlayShape } from "@/canvas/canvasState";
import type { RgbaColor } from "./color";

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rectangle = Position & Size;

export type Color = RgbaColor;

export type CanvasBitmapContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

export type CanvasVectorContext = {
  render: (shape: CanvasOverlayShape | null) => void;
};

export type CanvasContext = {
  bitmap: CanvasBitmapContext | null;
  vector: CanvasVectorContext | null;
};

