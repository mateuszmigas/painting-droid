import {
  createTextToImageSection,
  type TextToImageModel,
} from "./types/textToImageModel";
import { base64ToBlob } from "@/utils/image";
import { apiClient } from "@/utils/api-client";
import { getTranslations } from "@/translations";
import { handleHttpError } from "./utils";
import { createConfigSchema } from "./types/baseModel";
import type { CustomFieldsSchemaAsValues } from "@/utils/customFieldsSchema";
const translations = getTranslations().models;

const configSchema = createConfigSchema({
  server: {
    style: { columns: 2 },
    name: translations.config.server,
    type: "string",
    defaultValue: "http://127.0.0.1:7860",
  },
});

const textToImage = createTextToImageSection({
  optionsSchema: {
    size: {
      name: translations.options.size,
      type: "option-size",
      defaultValue: { width: 1024, height: 1024 },
      options: [
        { label: "1024x1024", value: { width: 1024, height: 1024 } },
        { label: "1152x896", value: { width: 1152, height: 896 } },
        { label: "1216x832", value: { width: 1216, height: 832 } },
        { label: "1344x768", value: { width: 1344, height: 768 } },
        { label: "1536x640", value: { width: 1536, height: 640 } },
        { label: "640x1536", value: { width: 640, height: 1536 } },
        { label: "768x1344", value: { width: 768, height: 1344 } },
        { label: "832x1216", value: { width: 832, height: 1216 } },
        { label: "896x1152", value: { width: 896, height: 1152 } },
      ],
    },
  },
  execute: async (_, prompt, options, config) => {
    const { server } = config as CustomFieldsSchemaAsValues<
      typeof configSchema
    >;
    const { size } = options;
    const url = `${server}/sdapi/v1/txt2img`;
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
      images: string[];
    };

    if (!data.images.length) {
      throw new Error("Failed to fetch image");
    }

    return {
      width: size.width,
      height: size.height,
      data: await base64ToBlob(data.images[0]),
    };
  },
});

export const model = {
  configSchema,
  type: "stable-diffusion-server",
  defaultName: "Stable Diffusion WebUI",
  predefined: false,
  url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
  textToImage,
} as const satisfies TextToImageModel;
