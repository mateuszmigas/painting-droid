export type ImageUncompressedBuffer = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

export type ImageCompressedBuffer = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

export const pickChunk = (
  base: ImageUncompressedBuffer,
  x: number,
  y: number,
  width: number,
  height: number
): ImageUncompressedBufferRect => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < height; i++) {
    const baseOffset = (y + i) * width * 4 + x * 4;
    const rectOffset = i * width * 4;
    data.set(
      base.data.subarray(baseOffset, baseOffset + width * 4),
      rectOffset
    );
  }
  return { x, y, width, height, data };
};

export type ImageUncompressedBufferRect = ImageUncompressedBuffer & {
  x: number;
  y: number;
};

export const applyRects = (
  base: ImageUncompressedBuffer,
  diffs: ImageUncompressedBufferRect[]
) => {
  for (const diff of diffs) {
    const { x, y, width, height, data } = diff;
    for (let i = 0; i < height; i++) {
      const baseOffset = (y + i) * width * 4 + x * 4;
      const rectOffset = i * width * 4;
      base.data.set(
        data.subarray(rectOffset, rectOffset + width * 4),
        baseOffset
      );
    }
  }
};

