import type { TransformerJsApi } from "./transformerJs.worker";
import { createProxyClient } from "@/utils/worker";

export const transformerJsClient = createProxyClient<TransformerJsApi>(
  () =>
    new Worker(new URL("./transformerJs.worker.ts", import.meta.url), {
      type: "module",
    })
);
