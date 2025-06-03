import type { RgbaColor } from "./color";
import type { Position } from "./common";
import type { ImageMask, ImageUncompressed } from "./imageData";

const getAtPosition = (image: ImageUncompressed, position: Position) => {
  const { width, data } = image;
  return !!data[position.y * width + position.x];
};

const setAtPosition = (
  image: ImageUncompressed,
  position: Position,
  value: boolean
) => {
  const { width, data } = image;
  data[position.y * width + position.x] = value ? 1 : 0;
};

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

  const fillData = fillMask.data;

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

  const filled = {
    data: new Uint8ClampedArray(width * height),
    width,
    height,
  };

  const shouldBeFilled = (position: { x: number; y: number }) => {
    if (
      position.x >= 0 &&
      position.x < width &&
      position.y >= 0 &&
      position.y < height
    ) {
      if (getAtPosition(filled, position)) {
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
      setAtPosition(filled, { x: lx - 1, y }, true);
      lx = lx - 1;
    }
    while (shouldBeFilled({ x, y })) {
      setAtPosition(filled, { x, y }, true);
      x = x + 1;
    }
    scan(lx, x - 1, y + 1);
    scan(lx, x - 1, y - 1);
  }

  return filled;
};

export const generateFillMaskFromBitmap = (
  mask: ImageMask,
  position: Position
): ImageMask => {
  const { width, height } = mask;

  const filled = {
    data: new Uint8ClampedArray(width * height),
    width,
    height,
  };

  const shouldBeFilled = (pos: { x: number; y: number }) => {
    if (pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height) {
      if (getAtPosition(filled, pos)) {
        return false;
      }
      return !!mask.data[pos.y * width + pos.x];
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
      setAtPosition(filled, { x: lx - 1, y }, true);
      lx = lx - 1;
    }
    while (shouldBeFilled({ x, y })) {
      setAtPosition(filled, { x, y }, true);
      x = x + 1;
    }
    scan(lx, x - 1, y + 1);
    scan(lx, x - 1, y - 1);
  }

  return filled;
};

export const fillImageWithMask = (
  imageData: ImageUncompressed,
  mask: ImageMask,
  color: RgbaColor
) => {
  const data = mask.data;
  for (let i = 0; i < data.length; i++) {
    if (data[i]) {
      const idx = i * 4;
      imageData.data[idx] = color.r;
      imageData.data[idx + 1] = color.g;
      imageData.data[idx + 2] = color.b;
      imageData.data[idx + 3] = color.a * 255;
    }
  }
  return imageData;
};
