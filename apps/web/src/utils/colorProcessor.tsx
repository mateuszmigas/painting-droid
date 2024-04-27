import type { HsvColor, RbgColor, HsvaColor, RgbaColor } from "./color";

// magic functions from https://stackoverflow.com/a/17243070
const hsvToRgb = (color: HsvColor): RbgColor => {
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

const rgbToHsv = (color: RbgColor): HsvColor => {
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

const hsvaToRgba = (color: HsvaColor): RgbaColor => {
  const { h, s, v, a } = color;
  const { r, g, b } = hsvToRgb({ h, s, v });
  return { r, g, b, a };
};

const rgbaToRgbaString = (color: RgbaColor): string => {
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const rgbaToHsva = (color: RgbaColor): HsvaColor => {
  const rgb = rgbToHsv(color);
  return { ...rgb, a: color.a };
};

export class ColorProcessor {
  private constructor(private rgbaColor: RgbaColor) {}

  public static fromRgba(color: RgbaColor): ColorProcessor {
    return new ColorProcessor(color);
  }

  public static fromHsva(color: HsvaColor): ColorProcessor {
    return new ColorProcessor(hsvaToRgba(color));
  }

  public static fromHsv(color: HsvColor): ColorProcessor {
    return new ColorProcessor(hsvaToRgba({ ...color, a: 1 }));
  }

  public toRgba(): RgbaColor {
    return this.rgbaColor;
  }

  public toHsva(): HsvaColor {
    return rgbaToHsva(this.rgbaColor);
  }

  public toHsv(): HsvColor {
    return rgbToHsv(this.rgbaColor);
  }

  public toRgbaString(): string {
    return rgbaToRgbaString(this.rgbaColor);
  }
}

