import { describe, expect, test } from "vitest";
import { ColorProcessor } from "./colorProcessor";

describe("colorProcessor", () => {
  test("fromHex", () => {
    const colorProcessor = ColorProcessor.fromHex("#FF00F0");

    expect(colorProcessor.toRgba()).toEqual({ r: 255, g: 0, b: 240, a: 1 });
  });

  test("toHex", () => {
    const colorProcessor = ColorProcessor.fromRgba({
      r: 255,
      g: 0,
      b: 240,
      a: 1,
    });

    expect(colorProcessor.toHex()).toBe("#FF00F0");
  });

  test("fromRgba", () => {
    const colorProcessor = ColorProcessor.fromRgba({
      r: 255,
      g: 0,
      b: 240,
      a: 1,
    });

    expect(colorProcessor.toRgba()).toEqual({
      r: 255,
      g: 0,
      b: 240,
      a: 1,
    });
  });

  test("toRgba", () => {
    const colorProcessor = ColorProcessor.fromRgba({
      r: 255,
      g: 0,
      b: 240,
      a: 1,
    });

    expect(colorProcessor.toRgba()).toEqual({
      r: 255,
      g: 0,
      b: 240,
      a: 1,
    });
  });

  test("fromHsva", () => {
    const colorProcessor = ColorProcessor.fromHsva({
      h: 180,
      s: 100,
      v: 100,
      a: 1,
    });

    expect(colorProcessor.toRgba()).toEqual({ r: 0, g: 255, b: 255, a: 1 });
  });

  test("toHsva", () => {
    const colorProcessor = ColorProcessor.fromRgba({
      r: 0,
      g: 255,
      b: 255,
      a: 1,
    });

    expect(colorProcessor.toHsva()).toEqual({
      h: 180,
      s: 100,
      v: 100,
      a: 1,
    });
  });

  test("fromHsv", () => {
    const colorProcessor = ColorProcessor.fromHsv({ h: 180, s: 100, v: 100 });

    expect(colorProcessor.toRgba()).toEqual({ r: 0, g: 255, b: 255, a: 1 });
  });

  test("toRgbaString", () => {
    const colorProcessor = ColorProcessor.fromRgba({
      r: 0,
      g: 255,
      b: 255,
      a: 0.5,
    });

    expect(colorProcessor.toRgbaString()).toBe("rgba(0, 255, 255, 0.5)");
  });

  test("toRgbString", () => {
    const colorProcessor = ColorProcessor.fromRgba({
      r: 0,
      g: 255,
      b: 255,
      a: 1,
    });

    expect(colorProcessor.toRgbString()).toBe("rgb(0, 255, 255)");
  });
});
