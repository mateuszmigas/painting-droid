import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";

export type TextToImageOption =
  | {
      type: "string";
      name: string;
      default: string;
    }
  | {
      type: "select";
      name: string;
      default: unknown;
      options?: Array<{ value: unknown; label: string }>;
    };

export type TextToImageModel = BaseModel & {
  textToImage: {
    options: Record<string, TextToImageOption>;
    execute: (
      modelId: string,
      text: string,
      options: Record<string, unknown>
    ) => Promise<ImageCompressed>;
  };
};

