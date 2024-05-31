import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";
import type {
  CustomFieldsSchema,
  CustomFieldsSchemaAsValues,
} from "@/utils/customFieldsSchema";

export type ImageToImageSection<
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema
> = {
  optionsSchema: TOptionsSchema;
  execute: (
    modelId: string,
    text: string,
    image: ImageCompressed,
    options: CustomFieldsSchemaAsValues<TOptionsSchema>,
    config: CustomFieldsSchemaAsValues<TConfigSchema>
  ) => Promise<ImageCompressed>;
};

export const createImageToImageSection = <
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema
>(
  section: ImageToImageSection<TOptionsSchema, TConfigSchema>
) => section;

export type ImageToImageModel = BaseModel & {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  imageToImage: ImageToImageSection<any, any>;
};
