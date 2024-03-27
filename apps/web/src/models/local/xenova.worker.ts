import { createProxyServer } from "@/utils/worker";
import type { ImageCompressedData } from "@/utils/imageData";
import { pipeline, env, type RawImage } from "@xenova/transformers";

const config = {
  task: "object-detection",
  model: "Xenova/detr-resnet-50",
  quantized: false,
};

env.allowLocalModels = false;
env.useBrowserCache = true;

type Classifier = (image: any, options: any) => Promise<string>;

let classifier: Classifier | null = null;
const getClassifier = async () => {
  if (!classifier) {
    classifier = pipeline(config.task as never, config.model, {
      quantized: config.quantized,
      progress_callback: (data) => console.log("progress", data),
    }) as never as Classifier;
  }
  return classifier;
};

const xenovaServer = {
  loadModel: async () => {
    await getClassifier();
  },
  classifyImage: async (imageData: ImageCompressedData) => {
    try {
      const classifier = await getClassifier();
      const outputs = await classifier(imageData.data, {
        threshold: 0.9,
        percentage: true,
      });
      // const result = await classifier(rawImage, { topk: 1 });
      // result.sort((a, b) => b[1] - a[1]);
      console.log("result", outputs);
      return { result: outputs[0].label };
    } catch (e) {
      console.log("zesralo sie", e);
    }
    // const output = await classifier(_data as any, {
    //   topk: 0, // Return all classes
    // });
    return { result: "dupa" };
  },
};

export type XenovaApi = typeof xenovaServer;
createProxyServer(self, xenovaServer);
