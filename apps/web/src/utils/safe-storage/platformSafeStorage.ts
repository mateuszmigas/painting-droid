export type PlatformSafeStorage = {
  set: (key: string, value: string) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

