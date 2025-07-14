import { invoke } from "@tauri-apps/api/core";
import type { PlatformSafeStorage } from "./platformSafeStorage";

export const desktopSafeStorage: PlatformSafeStorage = {
  set: async (key: string, value: string) => {
    await invoke("safe_storage_set", { key, value });
  },
  delete: async (key: string) => invoke("safe_storage_delete", { key }),
};
