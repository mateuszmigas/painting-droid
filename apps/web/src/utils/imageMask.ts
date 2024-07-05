import type { Position } from "./common";
import type { ImageUncompressed } from "./imageData";

export const getAtPosition = (image: ImageUncompressed, position: Position) => {
  const { width, data } = image;
  return !!data[position.y * width + position.x];
};

export const setAtPosition = (
  image: ImageUncompressed,
  position: Position,
  value: boolean
) => {
  const { width, data } = image;
  data[position.y * width + position.x] = value ? 1 : 0;
};

