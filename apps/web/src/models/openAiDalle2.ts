import {
  createTextToImageSection,
  type TextToImageModel,
} from "./types/textToImageModel";
import { apiClient } from "@/utils/api-client";
import { getTranslations } from "@/translations";
import { createApiKeyPlaceholder, handleHttpError } from "./utils";
const translations = getTranslations().models;

const textToImage = createTextToImageSection({
  optionsSchema: {
    size: {
      name: translations.options.size,
      type: "option-size",
      defaultValue: { width: 1024, height: 1024 },
      options: [
        { label: "1024x1024", value: { width: 1024, height: 1024 } },
        { label: "512x512", value: { width: 512, height: 512 } },
        { label: "256x256", value: { width: 256, height: 256 } },
      ],
    },
  },
  execute: async (modelId, prompt, options) => {
    const { size } = options;

    const url = "https://api.openai.com/v1/images/generations";

    const body = {
      model: "dall-e-2",
      prompt,
      n: 1,
      size: `${size.width}x${size.height}`,
    };

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${createApiKeyPlaceholder(modelId)}`,
    };

    const result = await apiClient.post(url, {
      body: JSON.stringify(body),
      headers,
    });

    handleHttpError(result.status);

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
});

export const model = {
  type: "open-ai-dalle2",
  defaultName: "OpenAI DALL-E 2",
  predefined: false,
  url: "https://openai.com/dall-e-2",
  useApiKey: true,
  textToImage,
} as const satisfies TextToImageModel;

