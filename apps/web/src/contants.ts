import { isSafari } from "./utils/platform";

export const workspace = {
  format: "pdw",
  version: 1,
};

export const supportedImageFormats = ["png", "jpeg"];

export const features = {
  offscreenCanvas: !isSafari(),
};
