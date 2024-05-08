import type { CanvasCapturedArea } from "@/canvas/canvasState";
import type { RgbaColor } from "./color";
import type { CanvasShape } from "@/components/solid/shapes/shape.solid";

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
  renderCapturedArea: (shape: CanvasCapturedArea | null) => void;
  renderShapes: (shapes: CanvasShape[]) => void;
};

export type CanvasContext = {
  bitmap: CanvasBitmapContext | null;
  vector: CanvasVectorContext | null;
};

