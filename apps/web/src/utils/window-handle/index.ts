import { isDesktop } from "../platform";
import type { PlatformWindowHandle } from "./platformWindowHandle";
import { desktopWindowHandle } from "./desktopWindowHandle";
import { webWindowHandle } from "./webWindowHandle";

const platformWindowHandle: PlatformWindowHandle = isDesktop()
  ? desktopWindowHandle
  : webWindowHandle;

export const windowHandle = {
  ...platformWindowHandle,
};

