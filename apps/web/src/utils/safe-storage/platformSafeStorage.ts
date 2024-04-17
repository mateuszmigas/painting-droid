export type PlatformSafeStorage = {
  set: (key: string, value: string) => Promise<void>;
  has: (key: string) => Promise<boolean>;
  delete: (key: string) => Promise<void>;
};

