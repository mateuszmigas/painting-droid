import type { CustomFieldsSchema, CustomFieldsSchemaAsValues } from "@/utils/customFieldsSchema";
import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";

export type RemoveBackgroundSection<
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema,
> = {
  optionsSchema: TOptionsSchema;
  execute: (
    modelId: string,
    image: ImageCompressed,
    options: CustomFieldsSchemaAsValues<TOptionsSchema>,
    config: CustomFieldsSchemaAsValues<TConfigSchema>,
  ) => Promise<ImageCompressed>;
};

export const createRemoveBackgroundSection = <
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema,
>(
  section: RemoveBackgroundSection<TOptionsSchema, TConfigSchema>,
) => section;

export type RemoveBackgroundModel = BaseModel & {
  // biome-ignore lint/suspicious/noExplicitAny: checked
  removeBackground: RemoveBackgroundSection<any, any>;
};
