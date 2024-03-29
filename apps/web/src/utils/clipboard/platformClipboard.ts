import type { ImageCompressedData } from "../imageData";

export type PlatformClipboard = {
  copyImage: (imageData: ImageCompressedData) => Promise<void>;
  pasteImage: () => Promise<ImageCompressedData | null>;
};

