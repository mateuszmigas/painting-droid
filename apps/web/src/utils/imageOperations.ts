import type { RgbaColor } from "./color";
import type { Position } from "./common";
import type { ImageUncompressed } from "./imageData";
import { ImageMask } from "./imageMask";

export const getPixelColor = (
  position: Position,
  imageData: ImageUncompressed
) => {
  const { x, y } = position;
  const index = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3] / 255,
  };
};

export const floodFill = (
  imageData: ImageUncompressed,
  position: Position,
  fillColor: RgbaColor,
  shouldFill: (targetColor: RgbaColor, originColor: RgbaColor) => boolean
) => {
  const originColor = getPixelColor(position, imageData);

  if (shouldFill(fillColor, originColor)) {
    return imageData;
  }

  const fillMask = generateFillMask(imageData, position, (color) =>
    shouldFill(color, originColor)
  );

  if (!fillMask) {
    return imageData;
  }

  const fillData = fillMask.getData();

  for (let maskIndex = 0; maskIndex < fillData.length; maskIndex++) {
    if (fillData[maskIndex]) {
      const imageIndex = maskIndex * 4;
      imageData.data[imageIndex] = fillColor.r;
      imageData.data[imageIndex + 1] = fillColor.g;
      imageData.data[imageIndex + 2] = fillColor.b;
      imageData.data[imageIndex + 3] = fillColor.a * 255;
    }
  }

  return imageData;
};

export const selectMask = (
  imageData: ImageUncompressed,
  position: Position,
  shouldFill: (color: RgbaColor) => boolean
): ImageMask | null => {
  return generateFillMask(imageData, position, shouldFill);
};

//https://en.wikipedia.org/wiki/Flood_fill#Span_filling
const generateFillMask = (
  imageData: ImageUncompressed,
  position: Position,
  shouldFill: (color: RgbaColor) => boolean
): ImageMask | null => {
  const { width, height } = imageData;

  const filled = new ImageMask(width, height);

  const shouldBeFilled = (position: { x: number; y: number }) => {
    if (
      position.x >= 0 &&
      position.x < width &&
      position.y >= 0 &&
      position.y < height
    ) {
      if (filled.get(position.x, position.y)) {
        return false;
      }
      const targetColor = getPixelColor(position, imageData);
      return shouldFill(targetColor);
    }
    return false;
  };

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
      filled.set(lx - 1, y, true);
      lx = lx - 1;
    }
    while (shouldBeFilled({ x, y })) {
      filled.set(x, y, true);
      x = x + 1;
    }
    scan(lx, x - 1, y + 1);
    scan(lx, x - 1, y - 1);
  }

  return filled;
};

