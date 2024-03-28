import type { Size } from "@/utils/common";
import type { ImageCompressedData } from "@/utils/imageData";

export type TextToImageModel = {
  name: string;
  url?: string;
  sizes: Size[];
  execute: (text: string, size: Size) => Promise<ImageCompressedData>;
};

