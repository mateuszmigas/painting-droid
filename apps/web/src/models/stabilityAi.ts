import type { Size } from "@/utils/common";
import type { TextToImageModel } from "./types/textToImageModel";
import { base64ToBlob } from "@/utils/image";
import { apiClient } from "@/utils/api-client";
import { handleHttpError } from "./errors";
import { getTranslations } from "@/translations";
const translations = getTranslations().models;

export const model = {
  type: "stability-ai",
  defaultName: "Stability AI",
  predefined: false,
  url: "https://stability.ai/",
  useApiKey: true,
  textToImage: {
    options: {
      size: {
        name: translations.options.size,
        type: "select",
        default: { width: 1024, height: 1024 },
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
      quality: {
        name: "Quality",
        type: "select",
        default: "medium",
        options: [
          { label: "low", value: "low" },
          { label: "medium", value: "medium" },
          { label: "high", value: "high" },
        ],
      },
    },
    execute: async (
      modelId: string,
      prompt: string,
      options: Record<string, unknown>
    ) => {
      const { size: sizeOption } = options;
      const size = sizeOption as Size;

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
        Authorization: `Bearer APIKEY(${modelId})`,
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
  },
} as const satisfies TextToImageModel;

