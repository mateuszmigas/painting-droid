import type { PlatformClipboard } from "./platformClipboard";
import { webClipboard } from "./webClipboard";
import { desktopClipboard } from "./desktopClipboard";
import { isDesktop } from "../platform";

const platformClipboard: PlatformClipboard = isDesktop()
  ? desktopClipboard
  : webClipboard;

export const clipboard = {
  ...platformClipboard,
};

