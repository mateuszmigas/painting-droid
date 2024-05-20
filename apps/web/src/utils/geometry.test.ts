import { describe, expect, test } from "vitest";
import { distanceBetweenPoints } from "./geometry";

describe("distanceBetweenPoints", () => {
  test("returns distance between two points", () => {
    expect(distanceBetweenPoints({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  test("returns zero if points are the same", () => {
    expect(distanceBetweenPoints({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
  });
});

