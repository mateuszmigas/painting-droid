import { describe, expect, test } from "vitest";
import { areColorsClose, areColorsEqual } from "./color";

describe("areColorsEqual", () => {
  test("returns true if colors are equal", () => {
    expect(
      areColorsEqual({ r: 0, g: 0, b: 0, a: 255 }, { r: 0, g: 0, b: 0, a: 255 })
    ).toBe(true);
  });
  test("returns false if colors are not equal", () => {
    expect(
      areColorsEqual({ r: 0, g: 0, b: 0, a: 255 }, { r: 0, g: 0, b: 0, a: 0 })
    ).toBe(false);
  });
});

describe("areColorsClose", () => {
  test("returns true if colors are close", () => {
    expect(
      areColorsClose(
        { r: 255, g: 0, b: 0, a: 1 },
        { r: 255, g: 0, b: 0, a: 1 },
        10
      )
    ).toBe(true);
  });
  test("returns false if colors are not close", () => {
    expect(
      areColorsClose({ r: 0, g: 0, b: 0, a: 255 }, { r: 0, g: 0, b: 0, a: 0 })
    ).toBe(false);
  });
});

