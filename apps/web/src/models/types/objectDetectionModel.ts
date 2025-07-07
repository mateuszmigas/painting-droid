import type { Rectangle } from "@/utils/common";
import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";
import type {
  CustomFieldsSchema,
  CustomFieldsSchemaAsValues,
} from "@/utils/customFieldsSchema";

export type ObjectDetectionResult = {
  label: string;
  score: number;
  box: Rectangle;
};

export type ObjectDetectionSection<
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema
> = {
  optionsSchema: TOptionsSchema;
  execute: (
    image: ImageCompressed,
    onProgress: (value: number, message: string) => void,
    options: CustomFieldsSchemaAsValues<TOptionsSchema>,
    config: CustomFieldsSchemaAsValues<TConfigSchema>
  ) => Promise<ObjectDetectionResult[]>;
};

export const createObjectDetectionSection = <
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema
>(
  section: ObjectDetectionSection<TOptionsSchema, TConfigSchema>
) => section;

export type ObjectDetectionModel = BaseModel & {
  // biome-ignore lint/suspicious/noExplicitAny: checked
  detectObjects: ObjectDetectionSection<any, any>;
};
