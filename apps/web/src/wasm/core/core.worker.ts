import { createProxyServer } from "@/utils/worker";
import init, { resize, grayscale, sepia } from "./core";
import coreUrl from "./core_bg.wasm?url";
import { ImageUncompressed } from "@/utils/imageData";
import { Size } from "@/utils/common";

const coreServer = {
  init: () => Promise.resolve(),
  resize: async (
    imageData: ImageUncompressed,
    newSize: Size
  ): Promise<ImageUncompressed> => {
    const view = new Uint8Array(imageData.data.buffer);
    const result = resize(
      view,
      imageData.width,
      imageData.height,
      newSize.width,
      newSize.height
    );
    return {
      width: newSize.width,
      height: newSize.height,
      data: new Uint8ClampedArray(result.buffer),
    };
  },
  grayscale: async (
    imageData: ImageUncompressed
  ): Promise<ImageUncompressed> => {
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
