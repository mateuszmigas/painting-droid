export type ApiClient = {
  post: (
    url: string,
    options: {
      body: string;
      headers: Record<string, string>;
    }
  ) => Promise<{ status: number; data: string }>;
};
