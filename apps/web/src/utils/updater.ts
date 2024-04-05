import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { isWeb } from "./platform";

export const checkForUpdates = async () => {
  if (isWeb()) {
    return false;
  }

  const update = await check();
  return {
    available: update?.available,
    version: update?.version,
    downloadAndInstall: async () => {
      if (update?.available) {
        await update.downloadAndInstall();
      }
    },
    restart: () => relaunch(),
  };
};

