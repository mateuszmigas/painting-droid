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
    return new ColorProcessor(hsvaToRgba({ ...color, a: 1 }));
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
    return rgbToHsv(this.rgbaColor);
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

