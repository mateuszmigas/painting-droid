import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { isDesktop } from "./platform";

export type Update = {
  version: string;
  downloadAndInstall: () => Promise<void>;
  restart: () => void;
};

export const checkForUpdates = async () => {
  if (!isDesktop()) {
    return null;
  }

  try {
    const update = await check();

    if (!update?.available) {
      return null;
    }

    return {
      version: update.version,
      downloadAndInstall: () => update.downloadAndInstall(),
      restart: () => relaunch(),
    };
  } catch {
    // Ignore errors
    return null;
  }
};

