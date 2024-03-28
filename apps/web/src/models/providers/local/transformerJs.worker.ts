import { createProxyServer } from "@/utils/worker";
import type { ImageCompressedData } from "@/utils/imageData";
import { pipeline, env } from "@xenova/transformers";
import { sizeToString } from "@/utils/format";

env.allowLocalModels = false;
env.useBrowserCache = true;

type LoadingProgressValue = {
  loaded: number;
  total: number;
  progress: number;
};

const createLazyPipeline = <T>(
  factory: (onLoading?: (value: LoadingProgressValue) => void) => Promise<T>
) => {
  let pipeline: T | null = null;
  return {
    getPipeline: async (onLoading?: (value: LoadingProgressValue) => void) => {
      if (!pipeline) {
        pipeline = await factory(onLoading);
      }
      return pipeline;
    },
  };
};

const objectDetectionPipeline = createLazyPipeline(
  (onLoading?: (value: LoadingProgressValue) => void) =>
    pipeline("object-detection", "Xenova/detr-resnet-50", {
      quantized: false,
      progress_callback: onLoading,
    })
);

const transformerJsServer = {
  detectObjects: async (
    imageData: ImageCompressedData,
    onProgress: (value: number, message: string) => void
  ) => {
    const pipeline = await objectDetectionPipeline.getPipeline((data) => {
      onProgress(
        data.progress,
        `${sizeToString(data.loaded)} / ${sizeToString(data.total)}`
      );
    });
    const result = await pipeline(imageData.data, {
      threshold: 0.9,
      percentage: true,
    });
    const output = (Array.isArray(result) ? result : [result]) as {
      label: string;
      score: number;
      box: { xmin: number; ymin: number; xmax: number; ymax: number };
    }[];
    return output;
  },
};

export type TransformerJsApi = typeof transformerJsServer;
createProxyServer(self, transformerJsServer);
