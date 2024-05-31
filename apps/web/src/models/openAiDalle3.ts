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
        { label: "1024x1792", value: { width: 1024, height: 1792 } },
        { label: "1792x1024", value: { width: 1792, height: 1024 } },
      ],
    },
    quality: {
      name: translations.options.quality.name,
      type: "option-string",
      defaultValue: "standard",
      options: [
        { label: translations.options.quality.standard, value: "standard" },
        { label: translations.options.quality.high, value: "hd" },
      ],
    },
  },
  execute: async (modelId, prompt, options) => {
    const { size } = options;

    const url = "https://api.openai.com/v1/images/generations";

    const body = {
      model: "dall-e-3",
      prompt,
      n: 1,
      quality: options.quality,
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
  type: "open-ai-dalle3",
  defaultName: "OpenAI DALL-E 3",
  predefined: false,
  url: "https://openai.com/dall-e-3",
  useApiKey: true,
  textToImage,
} as const satisfies TextToImageModel;

