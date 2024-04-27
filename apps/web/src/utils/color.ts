export type RbgColor = { r: number; g: number; b: number };
export type HsColor = { h: number; s: number };
export type HsvColor = HsColor & { v: number };
export type RgbaColor = RbgColor & { a: number };
export type HsvaColor = HsvColor & { a: number };

export const isValidHex = (hex: string): boolean => /^#[0-9A-F]{6}$/i.test(hex);
