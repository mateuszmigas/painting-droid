import {
  type ImageCompressedData,
  compressedDataToBlob,
  blobToCompressedData,
} from "../imageData";
import type { PlatformClipboard } from "./platformClipboard";

const copyImage = async (imageData: ImageCompressedData): Promise<void> => {
  const blob = await compressedDataToBlob(imageData, "png");
  const data = [new ClipboardItem({ [blob.type]: blob })];
  return navigator.clipboard.write(data);
};

const pasteImage = async (): Promise<ImageCompressedData | null> => {
  const items = await navigator.clipboard.read();
  console.log("Pasting items...", items);
  for (const item of items) {
    for (const type of item.types) {
      if (type === "image/png") {
        const blob = await item.getType(type);
        return await blobToCompressedData(blob);
      }
    }
  }
  return null;
};

export const webClipboard: PlatformClipboard = {
  copyImage,
  pasteImage,
};

