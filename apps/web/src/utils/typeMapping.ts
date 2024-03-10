export type FilterKeys<Base, Condition> = {
  [Key in keyof Base]: Key extends Condition ? Key : never;
}[keyof Base];

export type StartsWith<T, X extends string> = FilterKeys<T, `${X}${string}`>;
