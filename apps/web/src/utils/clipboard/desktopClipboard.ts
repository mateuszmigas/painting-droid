import { readImage, writeImage } from "@tauri-apps/plugin-clipboard-manager";
import type { ImageCompressedData } from "../imageData";
import type { PlatformClipboard } from "./platformClipboard";

const copyImage = async (imageData: ImageCompressedData): Promise<void> => {
  const buffer = await imageData.arrayBuffer();
  await writeImage(buffer);
};

const pasteImage = async (): Promise<ImageCompressedData | null> => {
  try {
    const image = await readImage();
    const bytes = await image.rgba();
    return new Blob([bytes], { type: "image/png" });
  } catch {
    return null;
  }
};

export const desktopClipboard: PlatformClipboard = {
  copyImage,
  pasteImage,
};
