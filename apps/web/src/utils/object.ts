import isEqual from "lodash.isequal";

export const deepEqual = <T>(a: T, b: T) => isEqual(a, b);

export const spreadOmitKeys = <T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
) => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

