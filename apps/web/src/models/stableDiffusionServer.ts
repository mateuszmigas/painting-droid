import { getTranslations } from "@/translations";
import { apiClient } from "@/utils/api-client";
import type { CustomFieldsSchemaAsValues } from "@/utils/customFieldsSchema";
import { base64ToBlob, blobToDataUrl } from "@/utils/image";
import { createConfigSchema } from "./types/baseModel";
import { createImageToImageSection, type ImageToImageModel } from "./types/imageToImageModel";
import { createTextToImageSection, type TextToImageModel } from "./types/textToImageModel";
import { handleHttpError } from "./utils";

const translations = getTranslations().models;

const configSchema = createConfigSchema({
  server: {
    style: { columns: 2 },
    name: translations.config.server,
    type: "string",
    defaultValue: "http://127.0.0.1:7860",
  },
});

const imageToImage = createImageToImageSection({
  optionsSchema: {
    imageStrength: {
      name: translations.options.imageStrength,
      type: "option-number",
      defaultValue: 0.5,
      options: [
        { label: "0%", value: 0 },
        { label: "25%", value: 0.25 },
        { label: "50%", value: 0.75 },
        { label: "75%", value: 0.5 },
        { label: "100%", value: 1 },
      ],
    },
    steps: {
      name: translations.options.steps,
      type: "option-number",
      defaultValue: 30,
      options: [
        { label: "10", value: 10 },
        { label: "20", value: 20 },
        { label: "30", value: 30 },
        { label: "40", value: 40 },
        { label: "50", value: 50 },
      ],
    },
  },
  execute: async (_, prompt, image, options, config) => {
    const { server } = config as CustomFieldsSchemaAsValues<typeof configSchema>;
    const { steps, imageStrength } = options;

    const url = `${server}/sdapi/v1/img2img`;
    const body = {
      prompt,
      steps,
      width: image.width,
      height: image.height,
      denoising_strength: 1 - imageStrength,
      init_images: [await blobToDataUrl(image.data)],
    };

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
      width: image.width,
      height: image.height,
      data: await base64ToBlob(data.images[0]),
    };
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
    steps: {
      name: translations.options.steps,
      type: "option-number",
      defaultValue: 30,
      options: [
        { label: "10", value: 10 },
        { label: "20", value: 20 },
        { label: "30", value: 30 },
        { label: "40", value: 40 },
        { label: "50", value: 50 },
      ],
    },
  },
  execute: async (_, prompt, options, config) => {
    const { server } = config as CustomFieldsSchemaAsValues<typeof configSchema>;
    const { size, steps } = options;
    const url = `${server}/sdapi/v1/txt2img`;
    const body = { prompt, steps, size };

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
  imageToImage,
} as const satisfies TextToImageModel & ImageToImageModel;
