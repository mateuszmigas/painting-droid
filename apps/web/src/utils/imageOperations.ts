import type { RgbaColor } from "./color";
import type { Position } from "./common";
import type { ImageUncompressed } from "./imageData";

const getPixelColor = (position: Position, imageData: ImageUncompressed) => {
  const { x, y } = position;
  const index = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
};

const setPixelColor = (
  position: Position,
  targetColor: RgbaColor,
  imageData: ImageUncompressed
) => {
  const { width, data } = imageData;
  const index = (position.y * width + position.x) * 4;
  data[index] = targetColor.r;
  data[index + 1] = targetColor.g;
  data[index + 2] = targetColor.b;
  data[index + 3] = targetColor.a;
};

export const floodFill = (
  imageData: ImageUncompressed,
  position: Position,
  fillColor: RgbaColor,
  shouldFill: (targetColor: RgbaColor, originColor: RgbaColor) => boolean
) => spanFill(imageData, position, fillColor, shouldFill);

//https://en.wikipedia.org/wiki/Flood_fill#Span_filling
const spanFill = (
  imageData: ImageUncompressed,
  position: Position,
  fillColor: RgbaColor,
  shouldFill: (targetColor: RgbaColor, originColor: RgbaColor) => boolean
): ImageUncompressed => {
  const { width, height } = imageData;

  const originColor = getPixelColor(position, imageData);

  const shouldBeFilled = (position: { x: number; y: number }) => {
    if (
      position.x >= 0 &&
      position.x < width &&
      position.y >= 0 &&
      position.y < height
    ) {
      const targetColor = getPixelColor(position, imageData);
      return shouldFill(targetColor, originColor);
    }
    return false;
  };

  if (!shouldBeFilled(position)) {
    return imageData;
  }

  const stack: Position[] = [];
  stack.push(position);

  const scan = (lx: number, rx: number, y: number) => {
    let span_added = false;
    for (let x = lx; x <= rx; x++) {
      if (!shouldBeFilled({ x, y })) {
        span_added = false;
      } else if (!span_added) {
        stack.push({ x, y });
        span_added = true;
      }
    }
  };

  while (stack.length > 0) {
    let { x, y } = stack.pop()!;
    let lx = x;
    while (shouldBeFilled({ x: lx - 1, y })) {
      setPixelColor({ x: lx - 1, y }, fillColor, imageData);
      lx = lx - 1;
    }
    while (shouldBeFilled({ x, y })) {
      setPixelColor({ x, y }, fillColor, imageData);
      x = x + 1;
    }
    scan(lx, x - 1, y + 1);
    scan(lx, x - 1, y - 1);
  }

  return imageData;
};

