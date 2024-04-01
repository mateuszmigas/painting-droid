import { environment } from "@/environment";
import type { Size } from "@/utils/common";
import type { TextToImageModel } from "./textToImageModel";
import { base64ToBlob } from "@/utils/image";

export const model: TextToImageModel = {
  name: "Demo",
  url: "https://stability.ai/",
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
    const result = await fetch(environment.DEMO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, size }),
    });
    if (result.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    if (result.status !== 200) {
      throw new Error("Failed to fetch image");
    }
    const data = (await result.json()) as {
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
};
