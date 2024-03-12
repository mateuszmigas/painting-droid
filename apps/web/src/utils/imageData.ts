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

export const loadImageFromCompressed = (compressed: ImageCompressedData) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = compressed.data;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
  });
};

export const mergeCompressedData = async (
  compressedDataImages: ImageCompressedData[]
) => {
  const { width, height } = compressedDataImages[0];
  const context = createCanvasContext(width, height);

  for (const compressedData of compressedDataImages) {
    const image = await loadImageFromCompressed(compressedData);
    context.drawImage(image, 0, 0, width, height);
  }

  return createCompressedFromContext(context);
};

export const restoreContextFromCompressed = async (
  compressed: ImageCompressedData,
  context: CanvasContext
) => {
  const { width, height } = compressed;
  const image = await loadImageFromCompressed(compressed);
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
};

export const pickRectangleRegion = (
  imageData: ImageUncompressedData,
  region: Rectangle
): ImageUncompressedRegionRect => {
  const { x, y, width, height } = region;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < height; i++) {
    const baseOffset = (y + i) * width * 4 + x * 4;
    const rectOffset = i * width * 4;
    data.set(
      imageData.data.subarray(baseOffset, baseOffset + width * 4),
      rectOffset
    );
  }
  return { x, y, width, height, data };
};

export const applyRegions = (
  imageData: ImageUncompressedData,
  regions: ImageUncompressedRegionRect[]
) => {
  for (const diff of regions) {
    const { x, y, width, height, data } = diff;
    for (let i = 0; i < height; i++) {
      const baseOffset = (y + i) * width * 4 + x * 4;
      const rectOffset = i * width * 4;
      imageData.data.set(
        data.subarray(rectOffset, rectOffset + width * 4),
        baseOffset
      );
    }
  }
};
const createCanvasContext = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d") as CanvasContext;
  return context;
};
