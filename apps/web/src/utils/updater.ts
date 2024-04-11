import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { isWeb } from "./platform";

export type Update = {
  version: string;
  downloadAndInstall: () => Promise<void>;
  restart: () => void;
};

export const checkForUpdates = async () => {
  if (isWeb()) {
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
