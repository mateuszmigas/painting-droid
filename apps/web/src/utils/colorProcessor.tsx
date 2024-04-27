import type { HslColor, RbgColor, HslaColor, RgbaColor } from "./color";

const hslToRgb = (color: HslColor): RbgColor => {
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

const hslaToRgba = (color: HslaColor): RgbaColor => {
  const { h, s, l, a } = color;
  const { r, g, b } = hslToRgb({ h, s, l });
  return { r, g, b, a };
};

const rgbaToRgbaString = (color: RgbaColor): string => {
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const rgbToHsl = (color: RbgColor): HslColor => {
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

const rgbaToHsla = (color: RgbaColor): HslaColor => {
  const rgb = rgbToHsl(color);
  return { ...rgb, a: color.a };
};

export class ColorProcessor {
  private constructor(private rgbaColor: RgbaColor) {}

  public static fromRgba(color: RgbaColor): ColorProcessor {
    return new ColorProcessor(color);
  }

  public static fromHsla(color: HslaColor): ColorProcessor {
    return new ColorProcessor(hslaToRgba(color));
  }

  public static fromHsl(color: HslColor): ColorProcessor {
    return new ColorProcessor(hslaToRgba({ ...color, a: 1 }));
  }

  public toRgba(): RgbaColor {
    return this.rgbaColor;
  }

  public toHsla(): HslaColor {
    return rgbaToHsla(this.rgbaColor);
  }

  public toHsl(): HslColor {
    return rgbToHsl(this.rgbaColor);
  }
}

