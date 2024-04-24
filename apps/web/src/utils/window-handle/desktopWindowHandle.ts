import type { PlatformWindowHandle } from "./platformWindowHandle";
import { invoke } from "@tauri-apps/api/core";

export const desktopWindowHandle: PlatformWindowHandle = {
  showWindow: async () => invoke("show_window"),
};

