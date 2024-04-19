import type { Size } from "@/utils/common";
import type { TextToImageModel } from "./types/textToImageModel";
import { apiClient } from "@/utils/api-client";

export const model = {
  type: "open-ai-dalle3",
  defaultName: "OpenAI DALL-E 3",
  predefined: false,
  url: "https://openai.com/dall-e-3",
  useApiKey: true,
  textToImage: {
    sizes: [
      { width: 1024, height: 1024 },
      { width: 1024, height: 1792 },
      { width: 1792, height: 1024 },
    ],
    execute: async (modelId: string, prompt: string, size: Size) => {
      const url = "https://api.openai.com/v1/images/generations";

      const body = {
        model: "dall-e-3",
        prompt,
        n: 1,
        size: `${size.width}x${size.height}`,
      };

      const headers = {
        "content-type": "application/json",
        Authorization: `Bearer APIKEY(${modelId})`,
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
        data: [{ url: string }];
      };

      if (!data.data.length) {
        throw new Error("Failed to fetch image");
      }

      const imageResponse = await apiClient.getBytes(data.data[0].url);

      if (imageResponse.status !== 200) {
        throw new Error("Failed to fetch image");
      }

      return {
        width: size.width,
        height: size.height,
        data: new Blob([new Uint8Array(imageResponse.data)], {
          type: "image/png",
        }),
      };
    },
  },
} as const satisfies TextToImageModel;
