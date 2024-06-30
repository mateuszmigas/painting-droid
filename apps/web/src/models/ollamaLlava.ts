import { getTranslations } from "@/translations";
import { createConfigSchema } from "./types/baseModel";
import {
  type ChatModel,
  createChatSection,
  type ChatAction,
  type ChatActionKey,
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
Your task is to determine the image action in a prompt and return action keys as an array in JSON format.
Example response: 
{ "actions": ["${actions[0].key}", "${actions[1].key}"] }

Return action keys from this list, nothing else:
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

    const deferred = makeDeferred<ChatActionKey[]>();

    const getActions = async (prompt: string) => {
      try {
        const response = await fetchActionsResponse(server, prompt, actions);
        const body = await response.json();
        const result = JSON.parse(body.response);
        const sanitizedResult = Array.isArray(result)
          ? result
          : "actions" in result
          ? result.actions
          : [];
        deferred.resolve(sanitizedResult);
      } catch {
        // there is high probability that model returns random stuff but we don't care much,
        // it's just some extra suggestions that are not necessary
        deferred.resolve([]);
      }
    };

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

