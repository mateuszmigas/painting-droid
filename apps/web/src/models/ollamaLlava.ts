import { getTranslations } from "@/translations";
import { createConfigSchema } from "./types/baseModel";
import {
  type ChatModel,
  createChatSection,
  type ChatAction,
} from "./types/chatModel";
import type { CustomFieldsSchemaAsValues } from "@/utils/customFieldsSchema";
import { blobToBase64 } from "@/utils/image";
import { handleHttpError } from "./utils";
import { makeDeferred } from "@/utils/promise";
import type { ImageCompressed } from "@/utils/imageData";
const translations = getTranslations().models;

const imageModelSystemPrompt = "You are an assistant for a graphic program.";

const createActionsSystemPrompt = (
  actions: ChatAction[]
) => `You are an assistant for a graphic program. 
Your task is to determine the necessary image improvements included in a prompt as actions, but only from the provided list. 
The action format is: { key: action_key, description: action_description }
Respond with the required action names as an array in JSON format. Example: ['${actions
  .slice(0, 3)
  .map((a) => a.key)
  .join("','")}']

Available actions:
${actions.map((a) => `key: ${a.key}, description: ${a.description}`).join("\n")}
`;

const fetchPromptResponse = async (
  server: string,
  prompt: string,
  image: ImageCompressed | null
) => {
  const images = image ? [await blobToBase64(image.data)] : [];
  return fetch(server, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llava",
      system: imageModelSystemPrompt,
      prompt,
      images,
    }),
  });
};
const fetchActionsResponse = (
  server: string,
  prompt: string,
  actions: ChatAction[]
) => {
  return fetch(server, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      system: createActionsSystemPrompt(actions),
      format: "json",
      stream: false,
    }),
  });
};

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
  execute: async (_modelId, prompt, image, actions, _options, config) => {
    const { server } = config as CustomFieldsSchemaAsValues<
      typeof configSchema
    >;
    const response = await fetchPromptResponse(server, prompt, image);
    handleHttpError(response.status);

    if (!response.body) {
      throw new Error("Failed to send message to assistant.");
    }

    const getActions = async (prompt: string) => {
      console.log("fetching", prompt);
      try {
        const response = await fetchActionsResponse(server, prompt, actions);

        handleHttpError(response.status);

        if (!response.body) {
          throw new Error("Failed to send message to assistant.");
        }

        const body = await response.json();
        const result = JSON.parse(body);
        deferred.resolve(result.response);
      } catch (error) {
        deferred.reject(error);
      }
    };

    const deferred = makeDeferred<string[]>();

    let promptResponse = "";
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const parsed = JSON.parse(chunk) as ChatResponseChunk;
        controller.enqueue(parsed.response);
        promptResponse += parsed.response;
        parsed.done && getActions(promptResponse);
      },
    });

    const stream = response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(transformStream);

    return { stream, getActions: () => deferred.promise };
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
