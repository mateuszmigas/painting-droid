import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";
import type {
  CustomFieldsSchema,
  CustomFieldsSchemaAsValues,
} from "@/utils/customFieldsSchema";

export type TextToImageSection<
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema
> = {
  optionsSchema: TOptionsSchema;
  execute: (
    modelId: string,
    text: string,
    options: CustomFieldsSchemaAsValues<TOptionsSchema>,
    config: CustomFieldsSchemaAsValues<TConfigSchema>
  ) => Promise<ImageCompressed>;
};

export const createTextToImageSection = <
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema
>(
  section: TextToImageSection<TOptionsSchema, TConfigSchema>
) => section;

export type TextToImageModel = BaseModel & {
  // biome-ignore lint/suspicious/noExplicitAny: checked
  textToImage: TextToImageSection<any, any>;
};
