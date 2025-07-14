import type { Color, Size } from "./common";

export type CustomField = {
  style?: { columns: number };
} & (
  | {
      type: "string";
      name: string;
      defaultValue: string;
    }
  | {
      type: "color";
      name: string;
      defaultValue: Color;
    }
  | {
      type: "option-size";
      name: string;
      options: { value: Size; label: string }[];
      defaultValue: Size;
    }
  | {
      type: "option-string";
      name: string;
      options: { value: string; label: string }[];
      defaultValue: string;
    }
  | {
      type: "option-number";
      name: string;
      options: { value: number; label: string }[];
      defaultValue: number;
    }
  | {
      type: "range-number";
      name: string;
      defaultValue: number;
      min: number;
      max: number;
    }
  | {
      type: "range-percent";
      name: string;
      defaultValue: number;
      min: number;
      max: number;
    }
);

export type CustomFieldsSchema = Record<string, CustomField>;

export type CustomFieldsSchemaAsValues<T extends Record<string, CustomField>> = {
  [K in keyof T]: T[K]["defaultValue"];
};

export const getDefaultValues = (schema: Record<string, CustomField>) => {
  return Object.entries(schema).reduce(
    (acc, [key, value]) => {
      acc[key] = value.defaultValue;
      return acc;
    },
    {} as Record<string, unknown>,
  );
};
