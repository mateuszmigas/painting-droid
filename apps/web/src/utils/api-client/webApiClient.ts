import type { ApiClient } from "./apiClient";

export const webApiClient: ApiClient = {
  post: async (
    url: string,
    options: {
      body: string;
      headers: Record<string, string>;
    }
  ) => {
    const result = await fetch(url, {
      method: "POST",
      headers: options.headers,
      body: options.body,
    });
    if (result.status === 200) {
      return {
        status: result.status,
        data: await result.text(),
      };
    }
    return { status: result.status, data: "" };
  },
  getBytes: async (url: string) => {
    const result = await fetch(url);
    if (result.status === 200) {
      return {
        status: result.status,
        data: await result.arrayBuffer(),
      };
    }
    return { status: result.status, data: new ArrayBuffer(0) };
  },
};
