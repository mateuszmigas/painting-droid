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

