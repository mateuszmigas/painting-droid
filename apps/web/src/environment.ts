const env = (import.meta as unknown as { env: Record<string, string> }).env;

export const environment = {
  DEMO_API_URL: env.VITE_DEMO_API_URL,
};
