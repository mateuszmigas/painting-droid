import type { ApiClient } from "./apiClient";

export const webApiClient: ApiClient = {
  post: async (url: string, body: { type: "json"; data: string }) => {
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": `application/${body.type}` },
      body: body.data,
    });
    if (result.status === 200) {
      return {
        status: result.status,
        data: await result.text(),
      };
    }
    return { status: result.status, data: "" };
  },
};

