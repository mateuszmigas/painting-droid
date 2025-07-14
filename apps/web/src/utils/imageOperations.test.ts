import { describe, expect, test } from "vitest";
import { areColorsEqual } from "./color";
import { floodFill } from "./imageOperations";

describe("floodFill", () => {
  /* source image
    | x | 0 | 0 |
    | 0 | x | 0 |
    | 0 | 0 | x |
    */
  const fillColor = [0, 255, 0, 255];
  const emptyColor = [0, 0, 0, 255];
  const createSourceImageData = () => ({
    width: 3,
    height: 3,
    data: new Uint8ClampedArray([
      ...fillColor,
      ...emptyColor,
      ...emptyColor,
      ...emptyColor,
      ...fillColor,
      ...emptyColor,
      ...emptyColor,
      ...emptyColor,
      ...fillColor,
    ]),
  });

  test.each([1, 2, 5])("fills top right", (index) => {
    const newFillColor = { r: 255, g: 0, b: 0, a: 255 };
    const newFillColorArray = [newFillColor.r, newFillColor.g, newFillColor.b, newFillColor.a];
    const position = { y: ~~(index / 3), x: index % 3 };

    const result = floodFill(createSourceImageData(), position, newFillColor, areColorsEqual);

    expect(result.data).toEqual(
      new Uint8ClampedArray([
        ...fillColor,
        ...newFillColorArray,
        ...newFillColorArray,
        ...emptyColor,
        ...fillColor,
        ...newFillColorArray,
        ...emptyColor,
        ...emptyColor,
        ...fillColor,
      ]),
    );
  });

  test.each([3, 6, 7])("fills bottom left", (index) => {
    const newFillColor = { r: 255, g: 0, b: 0, a: 255 };
    const newFillColorArray = [newFillColor.r, newFillColor.g, newFillColor.b, newFillColor.a];
    const position = { y: ~~(index / 3), x: index % 3 };

    const result = floodFill(createSourceImageData(), position, newFillColor, areColorsEqual);

    expect(result.data).toEqual(
      new Uint8ClampedArray([
        ...fillColor,
        ...emptyColor,
        ...emptyColor,
        ...newFillColorArray,
        ...fillColor,
        ...emptyColor,
        ...newFillColorArray,
        ...newFillColorArray,
        ...fillColor,
      ]),
    );
  });

  test.each([0, 4, 8])("fills cross line", (index) => {
    const newFillColor = { r: 0, g: 255, b: 0, a: 255 };
    const newFillColorArray = [newFillColor.r, newFillColor.g, newFillColor.b, newFillColor.a];
    const position = { y: ~~(index / 3), x: index % 3 };

    const result = floodFill(createSourceImageData(), position, newFillColor, areColorsEqual);

    expect(result.data).toEqual(
      new Uint8ClampedArray([
        ...newFillColorArray,
        ...emptyColor,
        ...emptyColor,
        ...emptyColor,
        ...newFillColorArray,
        ...emptyColor,
        ...emptyColor,
        ...emptyColor,
        ...newFillColorArray,
      ]),
    );
  });
});
