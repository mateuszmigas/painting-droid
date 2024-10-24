import {
  hexToRgb,
  hsvaToRgba,
  rgbToHex,
  rgbToHsv,
  rgbaToHsva,
  rgbaToRgbaString,
  type HsvColor,
  type HsvaColor,
  type RgbaColor,
} from "./color";

export class ColorProcessor {
  private constructor(private rgbaColor: RgbaColor) {}

  public static fromRgba(color: RgbaColor): ColorProcessor {
    return new ColorProcessor(color);
  }

  public static fromHsva(color: HsvaColor): ColorProcessor {
    return new ColorProcessor(hsvaToRgba(color));
  }

  public static fromHsv(color: HsvColor): ColorProcessor {
    const rgba = hsvaToRgba({ ...color, a: 1 });
    if (color.s === 0 && color.v === 0) {
      rgba.r = rgba.g = rgba.b = 0;
    }
    return new ColorProcessor(rgba);
  }

  public static fromHex(hex: string): ColorProcessor {
    return new ColorProcessor({ ...hexToRgb(hex), a: 1 });
  }

  public toRgba(): RgbaColor {
    return this.rgbaColor;
  }

  public toHsva(): HsvaColor {
    return rgbaToHsva(this.rgbaColor);
  }

  public toHsv(): HsvColor {
    const hsv = rgbToHsv(this.rgbaColor);
    if (hsv.s === 0 && hsv.v === 0) {
      hsv.h = 0;
    }
    return hsv;
  }

  public toRgbaString(): string {
    return rgbaToRgbaString(this.rgbaColor);
  }

  public toRgbString(): string {
    const { r, g, b } = this.rgbaColor;
    return `rgb(${r}, ${g}, ${b})`;
  }

  public toHex(): string {
    return rgbToHex(this.rgbaColor);
  }
}
