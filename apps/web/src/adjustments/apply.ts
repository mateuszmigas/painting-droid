import type { ImageCompressedData } from "@/utils/imageData";
import type { AdjustmentId } from ".";

export const applyAdjustment = async (
  image: ImageCompressedData,
  _adjustmentId: AdjustmentId
): Promise<ImageCompressedData> => {
  return image;
};

