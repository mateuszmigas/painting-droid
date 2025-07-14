import { invoke } from "@tauri-apps/api/core";
import type { PlatformWindowHandle } from "./platformWindowHandle";

export const desktopWindowHandle: PlatformWindowHandle = {
  showWindow: async () => invoke("show_window"),
};
