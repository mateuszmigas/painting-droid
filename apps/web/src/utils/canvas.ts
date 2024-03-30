import type { CanvasContext } from "./common";
import { imageFromSrc } from "./image";
import type { ImageCompressedData, ImageUncompressedData } from "./imageData";

export const createCanvasContext = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d") as CanvasContext;
  return context;
};

export const clearContext = (context: CanvasContext) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const restoreContextFromCompressed = async (
  context: CanvasContext,
  compressed: ImageCompressedData
) => {
  const { width, height } = compressed;
  const image = await imageFromSrc(compressed.data);
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
};

export const restoreContextFromUncompressed = (
  context: CanvasContext,
  uncompressed: ImageUncompressedData
) => {
  context.putImageData(
    new ImageData(uncompressed.data, uncompressed.width, uncompressed.height),
    0,
    0
  );
};

