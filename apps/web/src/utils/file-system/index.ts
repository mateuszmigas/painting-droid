import { isDesktop } from "../platform";
import type { PlatformFileSystem } from "./platformFileSystem";
import { desktopFileSystem } from "./desktopFileSystem";
import { webFileSystem } from "./webFileSystem";

const platformFileSystem: PlatformFileSystem = isDesktop()
  ? desktopFileSystem
  : webFileSystem;

export const fileSystem = {
  ...platformFileSystem,
};

