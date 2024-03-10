import type { CanvasContext } from "@/utils/common";
import {
  createCompressedFromContext,
  restoreContextFromCompressed,
  type ImageCompressedData,
} from "@/utils/imageData";

const _cache = new Map<string, ImageCompressedData>();

export type CanvasHistoryContextHandle = {
  applyChanges: () => void;
  rejectChanges: () => void;
  getContext: () => CanvasContext;
};

export const useCanvasHistory = (context: CanvasContext) => {
  return {
    requestContextLock: (): CanvasHistoryContextHandle => {
      const cache = createCompressedFromContext(context);
      _cache.set("current", cache);
      return {
        applyChanges: () => {
          _cache.set("current", createCompressedFromContext(context));
        },
        rejectChanges: () => {
          const cache = _cache.get("current");
          if (cache) {
            restoreContextFromCompressed(cache, context);
          }
        },
        getContext: () => context,
      };
    },
  };
};

