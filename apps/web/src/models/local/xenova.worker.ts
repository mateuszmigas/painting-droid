import { createProxyServer } from "@/utils/worker";
import type { ImageCompressedData } from "@/utils/imageData";

const xenovaServer = {
  classifyImage: async (_data: ImageCompressedData) => {
    //todo
    return { result: "Message from web worker, I can't do that yet..." };
  },
};

export type XenovaApi = typeof xenovaServer;
createProxyServer(self, xenovaServer);

