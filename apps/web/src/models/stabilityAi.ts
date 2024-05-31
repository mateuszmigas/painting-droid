import {
  createTextToImageSection,
  type TextToImageModel,
} from "./types/textToImageModel";
import { base64ToBlob } from "@/utils/image";
import { apiClient } from "@/utils/api-client";
import { createApiKeyPlaceholder, handleHttpError } from "./utils";
import { getTranslations } from "@/translations";
import {
  type ImageToImageModel,
  createImageToImageSection,
} from "./types/imageToImageModel";
const translations = getTranslations().models;

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
  execute: async (modelId, prompt, image, options) => {
    const { steps, imageStrength } = options;

    const url =
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/image-to-image";

    const formData = new FormData();
    formData.append("init_image", image.data);
    formData.append("init_image_mode", "IMAGE_STRENGTH");
    formData.append("image_strength", imageStrength.toString());
    formData.append("text_prompts[0][text]", prompt);
    formData.append("steps", steps.toString());

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${createApiKeyPlaceholder(modelId)}`,
    };

    const result = await apiClient.post(url, {
      body: formData,
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
      width: image.width,
      height: image.height,
      data: await base64ToBlob(data.artifacts[0].base64),
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
  execute: async (modelId, prompt, options) => {
    const { size, steps } = options;

    const url =
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

    const body = {
      steps,
      width: size.width,
      height: size.height,
      text_prompts: [{ text: prompt, weight: 1 }],
    };

    const headers = {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${createApiKeyPlaceholder(modelId)}`,
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
  type: "stability-ai",
  defaultName: "Stability AI SDXL 1.0",
  predefined: false,
  url: "https://stability.ai/",
  useApiKey: true,
  textToImage,
  imageToImage,
} as const satisfies TextToImageModel & ImageToImageModel;
