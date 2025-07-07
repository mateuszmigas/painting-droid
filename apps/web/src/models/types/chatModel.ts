import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";
import type {
  CustomFieldsSchema,
  CustomFieldsSchemaAsValues,
} from "@/utils/customFieldsSchema";
import type { ChatAction, ChatActionKey } from "@/types/chat";

export type ChatSection<
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema
> = {
  optionsSchema: TOptionsSchema;
  execute: (
    modelId: string,
    prompt: string,
    image: ImageCompressed | null,
    actions: ChatAction[],
    options: CustomFieldsSchemaAsValues<TOptionsSchema>,
    config: CustomFieldsSchemaAsValues<TConfigSchema>
  ) => Promise<{
    stream: ReadableStream;
    getActions: () => Promise<ChatActionKey[]>;
  }>;
};

export const createChatSection = <
  TOptionsSchema extends CustomFieldsSchema,
  TConfigSchema extends CustomFieldsSchema
>(
  section: ChatSection<TOptionsSchema, TConfigSchema>
) => section;

export type ChatModel = BaseModel & {
  // biome-ignore lint/suspicious/noExplicitAny: checked
  chat: ChatSection<any, any>;
};
