import type { PlatformSafeStorage } from "./platformSafeStorage";

export const webSafeStorage: PlatformSafeStorage = {
  set: async () => {
    throw new Error("Not implemented");
  },
  delete: async () => {
    throw new Error("Not implemented");
  },
};

