import { isSafari } from "./utils/platform";

export const workspace = {
  format: "pdw",
  version: 1,
};

export const supportedImageFormats = ["png", "jpeg"];

export const features = {
  offscreenCanvas: !isSafari(),
};

export const domNames = {
  workspaceViewport: "workspace-viewport",
};

export const themes = ["light", "dark", "system"] as const;

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
