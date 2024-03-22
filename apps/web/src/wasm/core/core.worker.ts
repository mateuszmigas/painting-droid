import { createProxyServer } from "@/utils/worker";
import init, { greet } from "./core";
import coreUrl from "./core_bg.wasm?url";
import { ByteArray } from "@/utils/byteArray";

const coreServer = {
  hello: async (name: string) => {
    return { result: greet(name) };
  },
  sendBuffer: async (buffer: ByteArray) => {
    const view = new Int32Array(buffer.data);
    view[0] = 42;
    return buffer;
  },
};

export type CoreApi = typeof coreServer;
createProxyServer(self, coreServer, () => init(coreUrl));
