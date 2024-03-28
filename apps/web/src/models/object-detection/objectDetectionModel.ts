import type { Rectangle } from "@/utils/common";
import type { ImageCompressedData } from "@/utils/imageData";

export type ObjectDetectionResult = {
  label: string;
  score: number;
  box: Rectangle;
}[];

export type ObjectDetectionModel = {
  name: string;
  type: "object-detection";
  url?: string;
  settings: Record<string, unknown>;
  execute: (
    imageData: ImageCompressedData,
    onProgress: (value: number, message: string) => void
  ) => Promise<ObjectDetectionResult>;
};

