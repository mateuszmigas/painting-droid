import type { RgbaColor } from "./utils/color";
import { platform } from "./utils/platform";

export const workspace = {
  format: "pdw",
  version: 1,
  defaultSize:
    platform === "e2e"
      ? { width: 100, height: 100 }
      : { width: 1024, height: 1024 },
};

export const defaultCanvasColor: RgbaColor = { r: 255, g: 255, b: 255, a: 1 };

export const supportedImageFormats = ["png", "jpeg"];

export const domNames = {
  workspaceViewport: "workspace-viewport",
  canvasBackground: "canvas-background",
  svgHostId: "svg-host-id",
  svgGripClass: "svg-grip",
};

export const themes = ["system", "light", "dark"] as const;

export const markerColors = [
  "#6895D2",
  "#007F73",
  "#F3B95F",
  "#D04848",
  "#0802A3",
  "#4CCD99",
  "#FFF455",
];

export const links = {
  downloadDesktop: "https://github.com/mateuszmigas/painting-droid/releases",
};

