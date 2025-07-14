import { isDesktop } from "../platform";
import { desktopWindowHandle } from "./desktopWindowHandle";
import type { PlatformWindowHandle } from "./platformWindowHandle";
import { webWindowHandle } from "./webWindowHandle";

const platformWindowHandle: PlatformWindowHandle = isDesktop() ? desktopWindowHandle : webWindowHandle;

export const windowHandle = {
  ...platformWindowHandle,
};
