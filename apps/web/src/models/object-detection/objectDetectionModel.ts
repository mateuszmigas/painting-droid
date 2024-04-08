import type { Rectangle } from "@/utils/common";
import type { ImageCompressed } from "@/utils/imageData";

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
    image: ImageCompressed,
    onProgress: (value: number, message: string) => void
  ) => Promise<ObjectDetectionResult>;
};
