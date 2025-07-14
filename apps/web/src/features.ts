import { isMobile, platform } from "./utils/platform";

export const features = {
  offscreenCanvas:
    platform !== "e2e" && typeof OffscreenCanvas !== "undefined" && "oncontextlost" in new OffscreenCanvas(0, 0),
  nativeMenuBar: false, //waiting for tauri fix, platform === "darwin",
  nativeColorPicker: isMobile(),
  shareFiles: "share" in navigator,
  computeShaders: "gpu" in navigator,
  chatActions: false,
};
