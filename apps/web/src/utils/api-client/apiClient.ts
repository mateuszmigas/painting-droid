export type ApiClient = {
  post: (
    url: string,
    body: { type: "json"; data: string }
  ) => Promise<{ status: number; data: string }>;
};

