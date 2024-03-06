export const isFunction = (x: any): x is Function => {
  return typeof x === "function";
};

export const assertNever = (value: never): never => {
  throw new Error("Unexpected object: " + value);
};

