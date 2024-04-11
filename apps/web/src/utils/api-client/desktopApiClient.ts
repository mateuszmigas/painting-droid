import { invoke } from "@tauri-apps/api/core";
import type { ApiClient } from "./apiClient";

export const desktopApiClient: ApiClient = {
  post: async (url: string, body: { type: "json"; data: string }) => {
    const result = (await invoke("send_request", {
      url,
      body: body.data,
    })) as {
      status: number;
      data: string;
    };
    return result;
  },
};

