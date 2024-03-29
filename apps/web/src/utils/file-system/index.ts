import { isWeb } from "../platform";
import type { PlatformFileSystem } from "./platformFileSystem";
import { desktopFileSystem } from "./desktopFileSystem";
import { webFileSystem } from "./webFileSystem";

const platformFileSystem: PlatformFileSystem = isWeb()
  ? webFileSystem
  : desktopFileSystem;

export const fileSystem = {
  ...platformFileSystem,
};

