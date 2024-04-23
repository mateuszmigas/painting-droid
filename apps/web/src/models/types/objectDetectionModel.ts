import type { Rectangle } from "@/utils/common";
import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";
import type {
  CustomFieldsSchema,
  CustomFieldsSchemaValues,
} from "@/utils/customFieldsSchema";

export type ObjectDetectionResult = {
  label: string;
  score: number;
  box: Rectangle;
}[];

export type ObjectDetectionSection<TSchema extends CustomFieldsSchema> = {
  optionsSchema: TSchema;
  execute: (
    image: ImageCompressed,
    onProgress: (value: number, message: string) => void,
    options: CustomFieldsSchemaValues<TSchema>
  ) => Promise<ObjectDetectionResult>;
};

export const createObjectDetectionSection = <
  TSchema extends CustomFieldsSchema
>(
  section: ObjectDetectionSection<TSchema>
) => section;

export type ObjectDetectionModel = BaseModel & {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  detectObjects: ObjectDetectionSection<any>;
};

