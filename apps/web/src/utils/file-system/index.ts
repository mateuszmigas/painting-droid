import { isDesktop } from "../platform";
import { desktopFileSystem } from "./desktopFileSystem";
import type { PlatformFileSystem } from "./platformFileSystem";
import { webFileSystem } from "./webFileSystem";

const platformFileSystem: PlatformFileSystem = isDesktop() ? desktopFileSystem : webFileSystem;

export const fileSystem = {
  ...platformFileSystem,
};
