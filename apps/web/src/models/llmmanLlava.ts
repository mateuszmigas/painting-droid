import { chat, createServerConfigSchema } from "./ollamaLlava";
import type { ChatModel } from "./types/chatModel";

// llmman (https://github.com/llmmanorg/llmman) serves the Ollama API on port 17434,
// so the Ollama LLaVA request handling is reused with a different default server.
export const model = {
  type: "llmman/llava",
  defaultName: "llmman LLaVA",
  predefined: false,
  url: "https://github.com/llmmanorg/llmman",
  configSchema: createServerConfigSchema("http://localhost:17434/api/generate"),
  chat,
} as const satisfies ChatModel;
