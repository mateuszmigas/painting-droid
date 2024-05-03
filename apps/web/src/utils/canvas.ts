import type { CanvasRasterContext } from "./common";
import type { ImageCompressedData, ImageUncompressed } from "./imageData";

export const createCanvasContext = (width: number, height: number) => {
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d") as CanvasRasterContext;
  return context;
};

export const clearContext = (context: CanvasRasterContext) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const convertToBlob = (context: CanvasRasterContext, type: string) => {
  if (context instanceof OffscreenCanvasRenderingContext2D) {
    return context.canvas.convertToBlob({ type });
  }
  return new Promise<Blob>((resolve) =>
    context.canvas.toBlob((blob) => resolve(blob!), type)
  );
};

export const restoreContextFromCompressed = async (
  context: CanvasRasterContext,
  data: ImageCompressedData
) => {
  const image = await createImageBitmap(data);
  const { width, height } = image;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
};

export const restoreContextFromUncompressed = (
  context: CanvasRasterContext,
  uncompressed: ImageUncompressed
) => {
  context.putImageData(
    new ImageData(uncompressed.data, uncompressed.width, uncompressed.height),
    0,
    0
  );
};

