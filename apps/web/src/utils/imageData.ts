import { Rectangle } from "./common";

export type ImageUncompressedData = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

export type ImageCompressedData = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

export type ImageUncompressedRegionRect = ImageUncompressedData & {
  x: number;
  y: number;
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

