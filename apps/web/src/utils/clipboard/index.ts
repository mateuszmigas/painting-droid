import { isDesktop } from "../platform";
import { desktopClipboard } from "./desktopClipboard";
import type { PlatformClipboard } from "./platformClipboard";
import { webClipboard } from "./webClipboard";

const platformClipboard: PlatformClipboard = isDesktop() ? desktopClipboard : webClipboard;

export const clipboard = {
  ...platformClipboard,
};
