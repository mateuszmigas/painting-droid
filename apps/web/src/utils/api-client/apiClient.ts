export type ApiClient = {
  post: (
    url: string,
    options: {
      body: string | FormData;
      headers: Record<string, string>;
    }
  ) => Promise<{ status: number; data: string }>;
  getBytes: (url: string) => Promise<{ status: number; data: ArrayBuffer }>;
};

