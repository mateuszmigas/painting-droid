import { isWeb } from "../platform";
import type { PlatformSafeStorage } from "./platformSafeStorage";
import { desktopSafeStorage } from "./desktopSafeStorage";
import { webSafeStorage } from "./webSafeStorage";

const platformSafeStorage: PlatformSafeStorage = isWeb()
  ? webSafeStorage
  : desktopSafeStorage;

export const safeStorage = {
  ...platformSafeStorage,
};

