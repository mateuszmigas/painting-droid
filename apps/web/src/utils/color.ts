export type RbgColor = { r: number; g: number; b: number };
export type HsColor = { h: number; s: number };
export type HsvColor = HsColor & { v: number };
export type RgbaColor = RbgColor & { a: number };
export type HsvaColor = HsvColor & { a: number };

export type Color =
  | ({
      type: "rgb";
    } & RbgColor)
  | ({
      type: "hsv";
    } & HsvColor)
  | ({
      type: "rgba";
    } & RgbaColor)
  | ({
      type: "hsla";
    } & HsvaColor);

