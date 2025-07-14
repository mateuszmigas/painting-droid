import { isDesktop } from "../platform";
import { desktopSafeStorage } from "./desktopSafeStorage";
import type { PlatformSafeStorage } from "./platformSafeStorage";
import { webSafeStorage } from "./webSafeStorage";

const platformSafeStorage: PlatformSafeStorage = isDesktop() ? desktopSafeStorage : webSafeStorage;

export const safeStorage = {
  ...platformSafeStorage,
};
