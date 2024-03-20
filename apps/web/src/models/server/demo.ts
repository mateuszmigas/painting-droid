import { environment } from "@/environment";
import type { Size } from "@/utils/common";

export const demoModel = {
  category: "text-to-image",
  name: "Demo",
  description: "Demo model",
  availableSizes: [
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
  request: async (prompt: string, size: Size) => {
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
    return data.artifacts[0].base64;
  },
};

