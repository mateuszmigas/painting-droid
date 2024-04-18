import type { ObjectDetectionModel } from "./types/objectDetectionModel";
import { transformerJsClient } from "./providers/local/transformerJsClient";
import { sortBySelector } from "@/utils/array";

export const model = {
  type: "facebook/detr-resnet-50",
  defaultName: "Facebook DETR ResNet-50",
  predefined: true,
  url: "https://huggingface.co/facebook/detr-resnet-50",
  detectObjects: {
    settings: {},
    execute: async (imageData, onProgress) => {
      const result = await transformerJsClient.detectObjects(
        imageData,
        onProgress
      );
      return sortBySelector(result, (item) => item.score, false).map(
        (item) => ({
          label: item.label,
          score: item.score,
          box: {
            x: item.box.xmin * imageData.width,
            y: item.box.ymin * imageData.height,
            width: (item.box.xmax - item.box.xmin) * imageData.width,
            height: (item.box.ymax - item.box.ymin) * imageData.height,
          },
        })
      );
    },
  },
} as const satisfies ObjectDetectionModel;

