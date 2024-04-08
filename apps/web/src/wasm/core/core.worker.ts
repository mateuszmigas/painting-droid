import { createProxyServer } from "@/utils/worker";
import init, { greet, grayscale, sepia } from "./core";
import coreUrl from "./core_bg.wasm?url";
import { ImageUncompressed } from "@/utils/imageData";

const coreServer = {
  init: () => Promise.resolve(),
  hello: async (name: string) => {
    return { result: greet(name) };
  },
  grayscale: async (
    imageData: ImageUncompressed
  ): Promise<ImageUncompressed> => {
    const view = new Uint8Array(imageData.data.buffer);
    const result = grayscale(view, imageData.width, imageData.height);

    return {
      width: imageData.width,
      height: imageData.height,
      data: new Uint8ClampedArray(result.buffer),
    };
  },
  sepia: async (imageData: ImageUncompressed): Promise<ImageUncompressed> => {
    const view = new Uint8Array(imageData.data.buffer);
    const result = sepia(view, imageData.width, imageData.height);

    return {
      width: imageData.width,
      height: imageData.height,
      data: new Uint8ClampedArray(result.buffer),
    };
  },
};

export type CoreApi = typeof coreServer;
createProxyServer(self, coreServer, () => init(coreUrl));
