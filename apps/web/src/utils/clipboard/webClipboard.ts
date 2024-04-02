import type { ImageCompressedData } from "../imageData";
import type { PlatformClipboard } from "./platformClipboard";

const copyImage = async (imageData: ImageCompressedData): Promise<void> => {
  return navigator.clipboard.write([
    new ClipboardItem({
      "image/png": imageData.data,
    }),
  ]);
};

const pasteImage = async (): Promise<ImageCompressedData | null> => {
  const items = await navigator.clipboard.read();
  for (const item of items) {
    for (const type of item.types) {
      if (type === "image/png") {
        const blob = await item.getType(type);
        const { width, height } = await createImageBitmap(blob);
        return {
          data: blob,
          width,
          height,
        };
      }
    }
  }
  return null;
};

export const webClipboard: PlatformClipboard = {
  copyImage,
  pasteImage,
};

