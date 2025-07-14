export const isFunction = (x: unknown): x is () => void => {
  return typeof x === "function";
};

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected object: ${value}`);
};
