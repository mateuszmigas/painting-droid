export type RgbColor = { r: number; g: number; b: number };
export type HsColor = { h: number; s: number };
export type HsvColor = HsColor & { v: number };
export type RgbaColor = RgbColor & { a: number };
export type HsvaColor = HsvColor & { a: number };

export const isValidHex = (hex: string): boolean => /^#[0-9A-F]{6}$/i.test(hex);

// magic functions from https://stackoverflow.com/a/17243070
export const hsvToRgb = (color: HsvColor): RgbColor => {
  const h = color.h / 360;
  const s = color.s / 100;
  const v = color.v / 100;
  let r = 0;
  let g = 0;
  let b = 0;
  let i = 0;
  let f = 0;
  let p = 0;
  let q = 0;
  let t = 0;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      {
        r = v;
        g = t;
        b = p;
      }
      break;
    case 1:
      {
        r = q;
        g = v;
        b = p;
      }
      break;
    case 2:
      {
        r = p;
        g = v;
        b = t;
      }
      break;
    case 3:
      {
        r = p;
        g = q;
        b = v;
      }
      break;
    case 4:
      {
        r = t;
        g = p;
        b = v;
      }
      break;
    case 5:
      {
        r = v;
        g = p;
        b = q;
      }
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export const rgbToHsv = (color: RgbColor): HsvColor => {
  const { r, g, b } = color;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max / 255;

  switch (max) {
    case min:
      h = 0;
      break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);
      h /= 6 * d;
      break;
    case g:
      h = b - r + d * 2;
      h /= 6 * d;
      break;
    case b:
      h = r - g + d * 4;
      h /= 6 * d;
      break;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
};

export const hsvaToRgba = (color: HsvaColor): RgbaColor => {
  const { h, s, v, a } = color;
  const { r, g, b } = hsvToRgb({ h, s, v });
  return { r, g, b, a };
};

export const rgbaToRgbaString = (color: RgbaColor): string => {
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const rgbaToHsva = (color: RgbaColor): HsvaColor => {
  const rgb = rgbToHsv(color);
  return { ...rgb, a: color.a };
};

export const hexToRgb = (hex: string): RgbColor => {
  if (!isValidHex(hex)) {
    throw new Error("Invalid hex color");
  }
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(
    shorthandRegex,
    (_, r, g, b) => r + r + g + g + b + b
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    formattedHex
  )!;

  return {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16),
  };
};

export const rgbToHex = (color: RgbColor): string => {
  const { r, g, b } = color;
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)}`.toUpperCase();
};

export const normalizeRgb = (color: RgbColor) => {
  const { r, g, b } = color;
  return { r: r / 255, g: g / 255, b: b / 255 };
};

export const calculateLuminance = (color: RgbColor) => {
  const { r, g, b } = normalizeRgb(color);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const calculateForegroundColor = (color: RgbColor): RgbaColor => {
  const luminance = calculateLuminance(color);
  return luminance > 0.5
    ? { r: 0, g: 0, b: 0, a: 1 }
    : { r: 255, g: 255, b: 255, a: 1 };
};

export const areColorsEqual = (color1: RgbaColor, color2: RgbaColor) => {
  return (
    color1.r === color2.r &&
    color1.g === color2.g &&
    color1.b === color2.b &&
    color1.a === color2.a
  );
};

export const areColorsClose = (
  color1: RgbaColor,
  color2: RgbaColor,
  percentageTolerance = 10
) => {
  const rgbTolerance = 255 * (percentageTolerance / 100);
  const alphaTolerance = percentageTolerance / 100;
  return (
    Math.abs(color1.a - color2.a) <= alphaTolerance &&
    Math.abs(color1.r - color2.r) <= rgbTolerance &&
    Math.abs(color1.g - color2.g) <= rgbTolerance &&
    Math.abs(color1.b - color2.b) <= rgbTolerance
  );
};

