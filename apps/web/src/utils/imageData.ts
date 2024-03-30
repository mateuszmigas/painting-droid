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
