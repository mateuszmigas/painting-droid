import { createProxyServer } from "@/utils/worker";
import init, { grayscale, sepia, flood_fill } from "./core";
import coreUrl from "./core_bg.wasm?url";
import { ImageUncompressed } from "@/utils/imageData";
import type { RgbaColor } from "@/utils/color";
import type { Position } from "@/utils/common";

const coreServer = {
  init: () => Promise.resolve(),
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
  floodFill: async (
    imageData: ImageUncompressed,
    position: Position,
    color: RgbaColor,
    tolerance: number
  ): Promise<ImageUncompressed> => {
    const view = new Uint8Array(imageData.data.buffer);
    const result = flood_fill(
      view,
      imageData.width,
      imageData.height,
      position.x,
      position.y,
      color.r,
      color.g,
      color.b,
      color.a * 255,
      tolerance
    );

    return {
      width: imageData.width,
      height: imageData.height,
      data: new Uint8ClampedArray(result.buffer),
    };
  },
};

export type CoreApi = typeof coreServer;
createProxyServer(self, coreServer, () => init(coreUrl));
