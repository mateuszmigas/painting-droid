import { invoke } from "@tauri-apps/api/core";
import type { PlatformSafeStorage } from "./platformSafeStorage";

export const desktopSafeStorage: PlatformSafeStorage = {
  set: async (key: string, value: string) => {
    await invoke("safe_storage_set", { key, value });
  },
  has: (key: string) => invoke("safe_storage_has", { key }),
  delete: async (key: string) => invoke("safe_storage_remove", { key }),
};

