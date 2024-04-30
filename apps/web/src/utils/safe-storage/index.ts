import { isDesktop } from "../platform";
import type { PlatformSafeStorage } from "./platformSafeStorage";
import { desktopSafeStorage } from "./desktopSafeStorage";
import { webSafeStorage } from "./webSafeStorage";

const platformSafeStorage: PlatformSafeStorage = isDesktop()
  ? desktopSafeStorage
  : webSafeStorage;

export const safeStorage = {
  ...platformSafeStorage,
};

