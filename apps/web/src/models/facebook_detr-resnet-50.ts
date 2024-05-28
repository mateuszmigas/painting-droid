import {
  createObjectDetectionSection,
  type ObjectDetectionModel,
} from "./types/objectDetectionModel";
import { transformerJsClient } from "./providers/local/transformerJsClient";
import { sortBySelector } from "@/utils/array";

const detectObjects = createObjectDetectionSection({
  optionsSchema: {},
  execute: async (imageData, onProgress) => {
    const result = await transformerJsClient.detectObjects(
      imageData,
      onProgress
    );
    return sortBySelector(result, (item) => item.score, false).map((item) => ({
      label: item.label,
      score: item.score,
      box: {
        x: item.box.xmin * imageData.width,
        y: item.box.ymin * imageData.height,
        width: (item.box.xmax - item.box.xmin) * imageData.width,
        height: (item.box.ymax - item.box.ymin) * imageData.height,
      },
    }));
  },
});

export const model = {
  type: "facebook/detr-resnet-50",
  defaultName: "Facebook DETR ResNet-50",
  predefined: true,
  url: "https://huggingface.co/facebook/detr-resnet-50",
  detectObjects,
} as const satisfies ObjectDetectionModel;
