import type { CoreApi } from "./core.worker";
import { createProxyClient } from "@/utils/worker";

export const coreClient = createProxyClient<CoreApi>(
  () =>
    new Worker(new URL("./core.worker.ts", import.meta.url), {
      type: "module",
    })
);
