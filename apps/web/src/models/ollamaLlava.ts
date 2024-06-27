import { getTranslations } from "@/translations";
import { createConfigSchema } from "./types/baseModel";
import { type ChatModel, createChatSection } from "./types/chatModel";
import type { CustomFieldsSchemaAsValues } from "@/utils/customFieldsSchema";
import { blobToBase64 } from "@/utils/image";
import { handleHttpError } from "./utils";
import { makeDeferred } from "@/utils/promise";
const translations = getTranslations().models;

const imageModelSystemPrompt = `You are an assistant for a graphic program.`;
export const createActionsSystemPrompt = (
  commands: string[]
) => `You are an assistant for a graphic program. 
Your task is to determine the necessary image improvements included in a prompt as actions, but only from the provided list. 
Respond with the required actions as an array in JSON format. Example: ['${commands
  .slice(0, 3)
  .join("','")}']

Available actions:
${commands.join("\n")}
`;

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
    const response = await fetch(server, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava",
        system: imageModelSystemPrompt,
        prompt: prompt,
        images: image ? [await blobToBase64(image.data)] : [],
      }),
    });

    handleHttpError(response.status);

    if (!response.body) {
      throw new Error("Failed to send message to assistant.");
    }

    let accumulatedResponse = "";

    const deferredPromise = makeDeferred<string[]>();

    const getActions = async () => {
      const response = await fetch(server, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: accumulatedResponse,
          system: `
You are an assistant for a graphic program. 
Your task is to determine the necessary image improvements included in a prompt as actions, but only from the provided list. 
Respond with the required actions as an array in JSON format. Example: ['RemoveBackground', 'Sepia', 'Grayscale']

Available actions:
RemoveBackground
Sepia
Grayscale
Contrast
Brightness
Saturation
Vignette
Noise
Blur
Sharpen
Resize
Rotate
Crop
          `,
          format: "json",
          stream: false,
        }),
      });

      if (!response.body) {
        throw new Error("Failed to send message to assistant.");
      }

      const body = await response.json();
      console.log(JSON.parse(body.response));
    };

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const parsed = JSON.parse(chunk) as ChatResponseChunk;
        controller.enqueue(parsed.response);
        accumulatedResponse += parsed.response;
        if (parsed.done) {
          getActions();
        }
      },
    });

    const stream = response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(transformStream);

    return { stream, actions: deferredPromise.promise };
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

