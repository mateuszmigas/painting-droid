import type { PlatformClipboard } from "./platformClipboard";
import { webClipboard } from "./webClipboard";

const platformClipboard: PlatformClipboard = webClipboard;

export const clipboard = {
  ...platformClipboard,
};

