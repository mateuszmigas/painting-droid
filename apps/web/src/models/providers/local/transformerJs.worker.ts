import { createProxyServer } from "@/utils/worker";
import type { ImageCompressed, ImageCompressedData } from "@/utils/imageData";
import {
  AutoModel,
  AutoProcessor,
  RawImage,
  type ProgressInfo,
  type PretrainedModelOptions,
  type PretrainedConfig,
  pipeline,
  env,
} from "@huggingface/transformers";
import { sizeToString } from "@/utils/format";
import { ImageProcessor } from "@/utils/imageProcessor";

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
      progress_callback: (data: ProgressInfo) => {
        if (onLoading && data.status === "progress") {
          onLoading({
            loaded: data.loaded,
            total: data.total,
            progress: data.progress,
          });
        }
      },
      device: "webgpu",
    } as unknown as PretrainedModelOptions & { quantized?: boolean })
);

const transformerJsServer = {
  removeBackground: async (
    imageCompressed: ImageCompressed
  ): Promise<ImageCompressedData> => {
    const size = { width: 1024, height: 1024 };
    const needsResize =
      imageCompressed.width !== size.width ||
      imageCompressed.height !== size.height;
    const name = "briaai/RMBG-1.4";
    const model = await AutoModel.from_pretrained(
      name,
      {
        device: "webgpu",
        // Custom config for RMBG-1.4
        config: { model_type: "custom" } as PretrainedConfig,
      } as unknown as PretrainedModelOptions
    );
    const processor = await AutoProcessor.from_pretrained(
      name,
      {
        device: "webgpu",
        config: {
          do_normalize: true,
          do_pad: false,
          do_rescale: true,
          do_resize: true,
          image_mean: [0.5, 0.5, 0.5],
          feature_extractor_type: "ImageFeatureExtractor",
          image_std: [1, 1, 1],
          resample: 2,
          rescale_factor: 0.00392156862745098,
          size,
      },
    } as unknown as PretrainedModelOptions
    );

    let imageProcessor = ImageProcessor.fromCompressedData(
      imageCompressed.data
    );

    // Resize image to model input size
    if (needsResize) {
      imageProcessor.resize(size);
    }

    const imageData = await imageProcessor.toImageData();

    const inputRawImage = new RawImage(
      imageData.data,
      imageData.width,
      imageData.height,
      4
    );
    const outputRawImage = inputRawImage.clone();

    const { pixel_values } = await processor(inputRawImage);
    const { output } = await model({ input: pixel_values });
    const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8"));

    // Apply mask to image
    for (let i = 0; i < mask.data.length; ++i) {
      outputRawImage.data[4 * i + 3] = mask.data[i];
    }

    imageProcessor = ImageProcessor.fromImageData(
      new ImageData(
        new Uint8ClampedArray(outputRawImage.data),
        outputRawImage.width,
        outputRawImage.height
      )
    );

    // Resize image back to original size
    if (needsResize) {
      imageProcessor.resize({
        width: imageCompressed.width,
        height: imageCompressed.height,
      });
    }

    return imageProcessor.toCompressedData();
  },
  detectObjects: async (
    imageCompressed: ImageCompressed,
    onProgress: (value: number, message: string) => void
  ) => {
    const dataUrl = URL.createObjectURL(imageCompressed.data);
    try {
      const pipeline = await objectDetectionPipeline.getPipeline((data) => {
        onProgress(
          data.progress,
          `${sizeToString(data.loaded)} / ${sizeToString(data.total)}`
        );
      });
      const result = await pipeline(dataUrl, {
        threshold: 0.9,
        percentage: true,
      });
      const output = (Array.isArray(result) ? result : [result]) as {
        label: string;
        score: number;
        box: { xmin: number; ymin: number; xmax: number; ymax: number };
      }[];
      return output;
    } finally {
      URL.revokeObjectURL(dataUrl);
    }
  },
};

export type TransformerJsApi = typeof transformerJsServer;
createProxyServer(self, transformerJsServer);

