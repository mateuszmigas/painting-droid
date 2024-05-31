import { invoke } from "@tauri-apps/api/core";
import type { ApiClient } from "./apiClient";
import { blobToArrayBuffer } from "../image";

const createBodyObject = async (formData: FormData) => {
  const body: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      body[key] = {
        tag: "Text",
        content: value,
      };
    } else {
      const arrayBuffer = await blobToArrayBuffer(value);
      const content = Array.from(new Uint8Array(arrayBuffer as ArrayBuffer));
      body[key] = {
        tag: "Buffer",
        content,
      };
    }
  }
  return body;
};

export const desktopApiClient: ApiClient = {
  post: async (
    url: string,
    options: {
      body: string | FormData;
      headers: Record<string, string>;
    }
  ) => {
    const body =
      options.body instanceof FormData
        ? { tag: "FormData", content: await createBodyObject(options.body) }
        : { tag: "Text", content: options.body };

    const result = (await invoke("send_request_post", {
      url,
      body,
      headers: options.headers,
    })) as {
      status: number;
      data: string;
    };
    return result;
  },
  getBytes: async (url: string) => {
    const result = (await invoke("send_request_get_bytes", {
      url,
    })) as {
      status: number;
      data: ArrayBuffer;
    };
    return result;
  },
};

