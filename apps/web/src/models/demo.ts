import { environment } from "@/environment";
import {
  createTextToImageSection,
  type TextToImageModel,
} from "./types/textToImageModel";
import { base64ToBlob } from "@/utils/image";
import { apiClient } from "@/utils/api-client";
import { getTranslations } from "@/translations";
import { handleHttpError } from "./utils";
const translations = getTranslations().models;

const textToImage = createTextToImageSection({
  configSchema: {},
  optionsSchema: {
    size: {
      name: translations.options.size,
      type: "option-size",
      defaultValue: { width: 1024, height: 1024 },
      options: [{ label: "1024x1024", value: { width: 1024, height: 1024 } }],
    },
  },
  execute: async (_, prompt, options) => {
    const { size } = options;
    const url = environment.DEMO_API_URL;
    const body = { prompt, size };

    const headers = {
      "content-type": "application/json",
      Accept: "application/json",
    };

    const result = await apiClient.post(url, {
      body: JSON.stringify(body),
      headers,
    });

    handleHttpError(result.status);

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
});

export const model = {
  type: "demo",
  defaultName: "Demo",
  predefined: true,
  url: "https://painting-droid-web.vercel.app",
  textToImage,
} as const satisfies TextToImageModel;

