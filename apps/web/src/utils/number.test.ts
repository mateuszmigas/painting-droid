import { describe, expect, test } from "vitest";
import { randomRange } from "./number";

describe("randomRange", () => {
  test("returns a number within the range", () => {
    const min = 10;
    const max = 20;
    const result = randomRange(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });
});
