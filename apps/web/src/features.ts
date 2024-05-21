import { isMobile, platform } from "./utils/platform";

export const features = {
  offscreenCanvas:
    platform !== "e2e" && "oncontextlost" in new OffscreenCanvas(0, 0),
  nativeMenuBar: platform === "darwin",
  nativeColorPicker: isMobile(),
};

