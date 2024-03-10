import isEqual from "lodash.isequal";

export const deepEqual = <T>(a: T, b: T) => isEqual(a, b);
