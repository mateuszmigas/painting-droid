import { invoke } from "@tauri-apps/api/core";
import type { ApiClient } from "./apiClient";

export const desktopApiClient: ApiClient = {
  post: async (
    url: string,
    options: {
      body: string;
      headers: Record<string, string>;
    }
  ) => {
    const result = (await invoke("send_request", {
      url,
      body: options.body,
      headers: options.headers,
    })) as {
      status: number;
      data: string;
    };
    return result;
  },
};
