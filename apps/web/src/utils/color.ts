export type RbgColor = { r: number; g: number; b: number };
export type HslColor = { h: number; s: number; l: number };
export type RgbaColor = RbgColor & { a: number };
export type HslaColor = HslColor & { a: number };

export type Color =
  | ({
      type: "rgb";
    } & RbgColor)
  | ({
      type: "hsl";
    } & HslColor)
  | ({
      type: "rgba";
    } & RgbaColor)
  | ({
      type: "hsla";
    } & HslaColor);

export const hslToRgb = (color: HslColor): RbgColor => {
  let { h, s, l } = color;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
};

export const hslaToRgba = (color: HslaColor): RgbaColor => {
  const { h, s, l, a } = color;
  const { r, g, b } = hslToRgb({ h, s, l });
  return { r, g, b, a };
};

export const rgbaToRgbaString = (color: RgbaColor): string => {
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const rgbToHsl = (color: RbgColor): HslColor => {
  let { r, g, b } = color;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

