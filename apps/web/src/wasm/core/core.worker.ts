import type { ImageUncompressed } from "@/utils/imageData";
import { createProxyServer } from "@/utils/worker";
import init, { grayscale, sepia } from "./core";
import coreUrl from "./core_bg.wasm?url";

const coreServer = {
  init: () => Promise.resolve(),
  grayscale: async (imageData: ImageUncompressed): Promise<ImageUncompressed> => {
    const view = new Uint8Array(imageData.data.buffer);
    const result = grayscale(view);

    return {
      width: imageData.width,
      height: imageData.height,
      data: new Uint8ClampedArray(result.buffer),
    };
  },
  sepia: async (imageData: ImageUncompressed): Promise<ImageUncompressed> => {
    const view = new Uint8Array(imageData.data.buffer);
    const result = sepia(view);

    return {
      width: imageData.width,
      height: imageData.height,
      data: new Uint8ClampedArray(result.buffer),
    };
  },
};

export type CoreApi = typeof coreServer;
createProxyServer(self, coreServer, () => init(coreUrl));
