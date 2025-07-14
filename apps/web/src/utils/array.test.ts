import { describe, expect, test } from "vitest";
import { takeFirst, takeLast } from "./array";

describe("takeFirst", () => {
  test("take first lower than length", () => {
    const array = [1, 2, 3, 4, 5];
    const result = takeFirst(array, 3);
    expect(result).toEqual([1, 2, 3]);
  });

  test("take first equal to length", () => {
    const array = [1, 2, 3, 4, 5];
    const result = takeFirst(array, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  test("take first greater than length", () => {
    const array = [1, 2, 3, 4, 5];
    const result = takeFirst(array, 7);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("takeLast", () => {
  test("take last lower than length", () => {
    const array = [1, 2, 3, 4, 5];
    const result = takeLast(array, 3);
    expect(result).toEqual([3, 4, 5]);
  });

  test("take last equal to length", () => {
    const array = [1, 2, 3, 4, 5];
    const result = takeLast(array, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  test("take last greater than length", () => {
    const array = [1, 2, 3, 4, 5];
    const result = takeLast(array, 7);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});
