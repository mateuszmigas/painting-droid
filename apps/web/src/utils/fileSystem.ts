import { openAndReadFileAsText as openFileWeb } from "./html";
import { openAndReadFileAsText as openFileDesktop } from "./tauriClient";
import { isWeb } from "./platform";

export const openAndReadFileAsText = async (options: { extension: string }) =>
  isWeb() ? openFileWeb(options) : openFileDesktop(options);

