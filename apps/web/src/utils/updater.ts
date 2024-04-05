import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { isWeb } from "./platform";

export const checkForUpdates = async () => {
  if (isWeb()) {
    return null;
  }

  const update = await check();

  if (!update?.available) {
    return null;
  }

  return {
    version: update.version,
    downloadAndInstall: () => update.downloadAndInstall(),
    restart: () => relaunch(),
  };
};

