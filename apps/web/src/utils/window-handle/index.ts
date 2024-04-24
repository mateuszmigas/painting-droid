import { isWeb } from "../platform";
import type { PlatformWindowHandle } from "./platformWindowHandle";
import { desktopWindowHandle } from "./desktopWindowHandle";
import { webWindowHandle } from "./webWindowHandle";

const platformWindowHandle: PlatformWindowHandle = isWeb()
  ? webWindowHandle
  : desktopWindowHandle;

export const windowHandle = {
  ...platformWindowHandle,
};

