import { describe, expect, test } from "vitest";
import { transformBoundingBox } from "./shape";

describe("transformBoundingBox", () => {
  test("translates body of the box", () => {
    const boundingBox = { x: 0, y: 0, width: 100, height: 100 };
    const startPosition = { x: 10, y: 10 };
    const endPosition = { x: 20, y: 30 };
    const handle = "body";

    const result = transformBoundingBox(
      handle,
      boundingBox,
      startPosition,
      endPosition
    );

    expect(result).toEqual({ x: 10, y: 20, width: 100, height: 100 });
  });

  test("resizes top left corner of the box", () => {
    const boundingBox = { x: 0, y: 0, width: 100, height: 100 };
    const startPosition = { x: 10, y: 10 };
    const endPosition = { x: 20, y: 30 };
    const handle = "grip-top-left";

    const result = transformBoundingBox(
      handle,
      boundingBox,
      startPosition,
      endPosition
    );

    expect(result).toEqual({ x: 20, y: 30, width: 80, height: 70 });
  });

  test("resizes top right corner of the box", () => {
    const boundingBox = { x: 0, y: 0, width: 100, height: 100 };
    const startPosition = { x: 10, y: 10 };
    const endPosition = { x: 20, y: 30 };
    const handle = "grip-top-right";

    const result = transformBoundingBox(
      handle,
      boundingBox,
      startPosition,
      endPosition
    );

    expect(result).toEqual({ x: 0, y: 30, width: 20, height: 70 });
  });

  test("resizes bottom left corner of the box", () => {
    const boundingBox = { x: 0, y: 0, width: 100, height: 100 };
    const startPosition = { x: 10, y: 10 };
    const endPosition = { x: 20, y: 30 };
    const handle = "grip-bottom-left";

    const result = transformBoundingBox(
      handle,
      boundingBox,
      startPosition,
      endPosition
    );

    expect(result).toEqual({ x: 20, y: 0, width: 80, height: 30 });
  });

  test("resizes bottom right corner of the box", () => {
    const boundingBox = { x: 0, y: 0, width: 100, height: 100 };
    const startPosition = { x: 10, y: 10 };
    const endPosition = { x: 20, y: 30 };
    const handle = "grip-bottom-right";

    const result = transformBoundingBox(
      handle,
      boundingBox,
      startPosition,
      endPosition
    );

    expect(result).toEqual({ x: 0, y: 0, width: 20, height: 30 });
  });
});

