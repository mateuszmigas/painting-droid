import type { XenovaApi } from "./xenova.worker";
import { createProxyClient } from "@/utils/worker";

export const xenovaClient = createProxyClient<XenovaApi>(
  () =>
    new Worker(new URL("./xenova.worker.ts", import.meta.url), {
      type: "module",
    })
);

