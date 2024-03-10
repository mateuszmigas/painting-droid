import type { CanvasContext } from "@/utils/common";
import type { ImageCompressedData } from "@/utils/imageData";

type LayerData = ImageCompressedData["data"];

export const useCanvasHistory = () => {
  return {
    getLayersData: (): Record<string, LayerData> => {
      return {
        "1": new Uint8ClampedArray([1, 2, 3, 4]),
        "2": new Uint8ClampedArray([1, 2, 3, 4]),
      };
    },
    commitChanges: (_context: CanvasContext) => console.log("commit/save context to current"),
    revertChanges: (_context: CanvasContext) => console.log("revert/draw current to context"),
  };
};
