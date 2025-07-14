import { describe, expect, test } from "vitest";
import { spreadOmitKeys } from "./object";

describe("spreadOmitKeys", () => {
  test("should omit keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = spreadOmitKeys(obj, ["a", "c"]);
    expect(result).toEqual({ b: 2 });
  });
});
