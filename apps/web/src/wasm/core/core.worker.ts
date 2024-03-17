import { createProxyServer } from "@/utils/worker";
import init, { greet } from "./core";
import coreUrl from "./core_bg.wasm?url";

const coreServer = {
  hello: async (name: string) => {
    return { result: greet(name) };
  },
};

export type CoreApi = typeof coreServer;
createProxyServer(self, coreServer, () => init(coreUrl));
