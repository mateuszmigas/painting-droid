import type { BoundingBox, CanvasBitmapContext } from "./common";
import type { ImageCompressedData, ImageUncompressed } from "./imageData";

export const createCanvasContext = (width: number, height: number) => {
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d") as CanvasBitmapContext;
  return context;
};

export const clearContext = (context: CanvasBitmapContext) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const convertToBlob = (context: CanvasBitmapContext, type: string) => {
  if (context instanceof OffscreenCanvasRenderingContext2D) {
    return context.canvas.convertToBlob({ type });
  }
  return new Promise<Blob>((resolve) =>
    context.canvas.toBlob((blob) => resolve(blob!), type)
  );
};

export const restoreContextFromCompressed = async (
  context: CanvasBitmapContext,
  data: ImageCompressedData | null
) => {
  if (data) {
    const image = await createImageBitmap(data);
    const { width, height } = image;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
  } else {
    clearContext(context);
  }
};

export const restoreContextFromUncompressed = (
  context: CanvasBitmapContext,
  uncompressed: ImageUncompressed
) => {
  context.putImageData(
    new ImageData(uncompressed.data, uncompressed.width, uncompressed.height),
    0,
    0
  );
};

export const drawTransformedImage = (
  context: CanvasBitmapContext,
  boundingBox: BoundingBox,
  image: CanvasImageSource
) => {
  const { x, y, width, height } = boundingBox;
  const { width: canvasWidth, height: canvasHeight } = context.canvas;
  const flipHorizontal = width < 0;
  const flipVertical = height < 0;
  context.save();
  context.translate(
    flipHorizontal ? canvasWidth : 0,
    flipVertical ? canvasHeight : 0
  );
  context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
  context.drawImage(
    image,
    flipHorizontal ? canvasWidth - x : x,
    flipVertical ? canvasHeight - y : y,
    Math.abs(width),
    Math.abs(height)
  );
  context.restore();
};

