import { getTranslations } from "@/translations";
import { createConfigSchema } from "./types/baseModel";
import { type ChatModel, createChatSection } from "./types/chatModel";
import type { CustomFieldsSchemaAsValues } from "@/utils/customFieldsSchema";
import { blobToBase64 } from "@/utils/image";
import { handleHttpError } from "./utils";
import {
  createToolsSchemaFromCommands,
  serializeToolsSchema,
} from "@/utils/chatFunctionCalling";
const translations = getTranslations().models;

const configSchema = createConfigSchema({
  server: {
    style: { columns: 2 },
    name: translations.config.server,
    type: "string",
    defaultValue: "http://localhost:11434/api/generate",
  },
});

type ChatResponseChunk = {
  model: string;
  created_at: Date;
  response: string;
  done: boolean;
};

const chat = createChatSection({
  optionsSchema: {},
  execute: async (_, prompt, image, _options, config) => {
    const { server } = config as CustomFieldsSchemaAsValues<
      typeof configSchema
    >;
    const toolsSchema = createToolsSchemaFromCommands();
    const serializedSchema = serializeToolsSchema(toolsSchema);
    const newLocal = `
    Assistant: Only provide infromation about attached image and optionally list the actions user can perform. Here is list of actions you can use:
    actions: ${serializedSchema}

    return functions in format from available tools:
    ACTIONS: [
      {
        id: "applySepia",
        params: { amount: 0.3 },
      },
      {
        id: "removeBackground",
        params: {},
      }
    ]
    
    User: ${prompt}`;
    console.log(newLocal);
    const response = await fetch(server, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava",
        prompt: newLocal,
        images: image ? [await blobToBase64(image.data)] : [],
      }),
    });

    handleHttpError(response.status);

    if (!response.body) {
      throw new Error("Failed to send message to assistant.");
    }

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const parsed = JSON.parse(chunk) as ChatResponseChunk;
        controller.enqueue(parsed.response);
      },
    });

    return response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(transformStream);
  },
});

export const model = {
  type: "ollama/llava",
  defaultName: "Ollama LLaVA",
  predefined: false,
  url: "https://ollama.com/library/llava",
  configSchema,
  chat,
} as const satisfies ChatModel;

