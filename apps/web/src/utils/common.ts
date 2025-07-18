import type { Shape2d } from "@/components/solid/shapes/shape.solid";
import type { RgbaColor } from "./color";
export type { Shape2d };

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rectangle = Position & Size;
export type BoundingBox = Rectangle;

export type Color = RgbaColor;

export type CanvasBitmapContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export type CanvasVectorContext = {
  render: (groupId: "tool", shapes: Shape2d[]) => void;
  clear: (groupId: "tool") => void;
};

export type CanvasContext = {
  bitmap: CanvasBitmapContext | null;
  vector: CanvasVectorContext | null;
};

export type FilePath = string;
