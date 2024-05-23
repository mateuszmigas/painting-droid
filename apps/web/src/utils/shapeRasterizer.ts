import type { CanvasShape } from "@/canvas/canvasState";
import type { CanvasBitmapContext } from "./common";
import { drawTransformedImage } from "./canvas";
import { ImageProcessor } from "./imageProcessor";
import { assertNever } from "./typeGuards";
import { ColorProcessor } from "./colorProcessor";

const rasterizeRectangle = (
  context: CanvasBitmapContext,
  shape: Extract<CanvasShape, { type: "drawn-rectangle" }>
) => {
  const { x, y, width, height } = shape.boundingBox;
  const { fill, stroke } = shape;
  const { color, width: strokeWidth } = stroke;
  context.fillStyle = ColorProcessor.fromRgba(fill).toRgbaString();
  context.strokeStyle = ColorProcessor.fromRgba(color).toRgbaString();
  context.lineWidth = strokeWidth;
  context.fillRect(x, y, width, height);
  context.strokeRect(x, y, width, height);
};

const rasterizeEllipse = (
  context: CanvasBitmapContext,
  shape: Extract<CanvasShape, { type: "drawn-ellipse" }>
) => {
  const { x, y, width, height } = shape.boundingBox;
  const { fill, stroke } = shape;
  const { color, width: strokeWidth } = stroke;
  context.fillStyle = ColorProcessor.fromRgba(fill).toRgbaString();
  context.strokeStyle = ColorProcessor.fromRgba(color).toRgbaString();
  context.lineWidth = strokeWidth;
  context.beginPath();
  context.ellipse(
    x + width / 2,
    y + height / 2,
    width / 2,
    height / 2,
    0,
    0,
    Math.PI * 2
  );
  context.closePath();
  context.fill();
  context.stroke();
};

export const rasterizeShape = async (
  context: CanvasBitmapContext,
  shape: CanvasShape
) => {
  if (shape.capturedArea) {
    const capturedAreaContext = await ImageProcessor.fromCompressedData(
      shape.capturedArea.data
    ).toContext();

    drawTransformedImage(
      context,
      shape.boundingBox,
      capturedAreaContext.canvas
    );
  }

  switch (shape.type) {
    case "captured-rectangle":
      break;
    case "drawn-rectangle":
      rasterizeRectangle(context, shape);
      break;
    case "drawn-ellipse":
      rasterizeEllipse(context, shape);
      break;
    default:
      assertNever(shape);
  }
};

