import type { Size } from "@/utils/common";
import type { TextToImageModel } from "./types/textToImageModel";
import { base64ToBlob } from "@/utils/image";
import { apiClient } from "@/utils/api-client";

export const model = {
  type: "stability-ai",
  defaultName: "Stability AI",
  predefined: false,
  url: "https://stability.ai/",
  useApiKey: true,
  textToImage: {
    sizes: [
      { width: 1024, height: 1024 },
      { width: 1152, height: 896 },
      { width: 1216, height: 832 },
      { width: 1344, height: 768 },
      { width: 1536, height: 640 },
      { width: 640, height: 1536 },
      { width: 768, height: 1344 },
      { width: 832, height: 1216 },
      { width: 896, height: 1152 },
    ],
    execute: async (prompt: string, size: Size) => {
      const url =
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

      const body = {
        steps: 10,
        width: size.width,
        height: size.height,
        seed: 0,
        cfg_scale: 5,
        samples: 1,
        text_prompts: [{ text: prompt, weight: 1 }],
      };

      const headers = {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer __API_KEY__",
      };

      const result = await apiClient.post(url, {
        body: JSON.stringify(body),
        headers,
      });

      if (result.status === 429) {
        throw new Error("Rate limit exceeded");
      }
      if (result.status !== 200) {
        throw new Error("Failed to fetch image");
      }
      const data = JSON.parse(result.data) as {
        artifacts: { base64: string }[];
      };
      if (!data.artifacts.length) {
        throw new Error("Failed to fetch image");
      }
      return {
        width: size.width,
        height: size.height,
        data: await base64ToBlob(data.artifacts[0].base64),
      };
    },
  },
} as const satisfies TextToImageModel;
