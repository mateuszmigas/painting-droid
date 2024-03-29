import type { CanvasContext, Rectangle } from "./common";

export type ImageUncompressedData = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

export type ImageCompressedData = {
  width: number;
  height: number;
  data: string;
};

export type ImageUncompressedRegionRect = ImageUncompressedData & {
  x: number;
  y: number;
};

export const clearContext = (context: CanvasContext) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const createCompressedFromContext = (
  context: CanvasContext
): ImageCompressedData => {
  const { width, height } = context.canvas;
  const data = context.canvas.toDataURL("image/png");
  return { width, height, data };
};

export const loadImageFromData = (data: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = data;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
  });
};

export const compressedFromImage = (image: HTMLImageElement) => {
  const context = createCanvasContext(image.width, image.height);
  context.drawImage(image, 0, 0);
  return createCompressedFromContext(context);
};

export const compressedDataToBlob = async (
  compressed: ImageCompressedData,
  format: "jpeg" | "png"
) => {
  const context = createCanvasContext(compressed.width, compressed.height);
  await restoreContextFromCompressed(compressed, context);
  const dataUrl = context.canvas.toDataURL(`image/${format}`, 1.0);
  const response = await fetch(dataUrl);
  return await response.blob();
};

export const blobToCompressedData = async (blob: Blob) => {
  const dataUrl = URL.createObjectURL(blob);
  const image = await loadImageFromData(dataUrl);
  return compressedFromImage(image);
};

export const mergeCompressedData = async (
  compressedDataImages: ImageCompressedData[]
) => {
  const { width, height } = compressedDataImages[0];
  const context = createCanvasContext(width, height);

  for (const compressed of compressedDataImages) {
    const image = await loadImageFromData(compressed.data);
    context.drawImage(image, 0, 0, width, height);
  }

  return createCompressedFromContext(context);
};

export const restoreContextFromCompressed = async (
  compressed: ImageCompressedData,
  context: CanvasContext
) => {
  const { width, height } = compressed;
  const image = await loadImageFromData(compressed.data);
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
};

export const restoreContextFromUncompressed = (
  uncompressed: ImageUncompressedData,
  context: CanvasContext
) => {
  context.putImageData(
    new ImageData(uncompressed.data, uncompressed.width, uncompressed.height),
    0,
    0
  );
};

export const getImageDataFromCompressed = async (
  compressed: ImageCompressedData
) => {
  const context = createCanvasContext(compressed.width, compressed.height);
  await restoreContextFromCompressed(compressed, context);
  return context.getImageData(0, 0, compressed.width, compressed.height);
};

export const compressedFromImageData = async (
  imageData: ImageData
): Promise<ImageCompressedData> => {
  const context = createCanvasContext(imageData.width, imageData.height);
  context.putImageData(imageData, 0, 0);
  return createCompressedFromContext(context);
};

export const getRectangleCompressedFromContext = async (
  context: CanvasContext,
  rectangle: Rectangle
) => {
  const { x, y, width, height } = rectangle;
  const data = context.getImageData(x, y, width, height);
  const canvas = createCanvasContext(width, height);
  canvas.putImageData(data, 0, 0);
  return createCompressedFromContext(canvas);
};

export const putRectangleCompressedToContext = async (
  context: CanvasContext,
  compressed: ImageCompressedData,
  rectangle: Rectangle
) => {
  const { x, y, width, height } = rectangle;
  const image = await loadImageFromData(compressed.data);
  context.drawImage(image, x, y, width, height);
};

const createCanvasContext = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d") as CanvasContext;
  return context;
};

export const canvasContextFromCompressed = async (
  compressed: ImageCompressedData
) => {
  const context = createCanvasContext(compressed.width, compressed.height);
  await restoreContextFromCompressed(compressed, context);
  return context;
};
