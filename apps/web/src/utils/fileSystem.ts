import {
  openAndReadFileAsText as openAndReadFileAsTextWeb,
  saveTextToFile as saveTextToFileWeb,
  saveBlobToFile as saveBlobToFileWeb,
} from "./html";
import {
  openAndReadFileAsText as openAndReadFileAsTextDesktop,
  saveTextToFile as saveTextToFileDesktop,
  saveBlobToFile as saveBlobToFileDesktop,
} from "./tauriClient";
import { isWeb } from "./platform";

export const openAndReadFileAsText = async (options: { extension: string }) =>
  isWeb()
    ? openAndReadFileAsTextWeb(options)
    : openAndReadFileAsTextDesktop(options);

export const saveTextToFile = (
  text: string,
  filename: string,
  extension: string
) =>
  isWeb()
    ? saveTextToFileWeb(text, filename, extension)
    : saveTextToFileDesktop(text, filename, extension);

export const saveBlobToFile = (
  blob: Blob,
  filename: string,
  extension: string
) =>
  isWeb()
    ? saveBlobToFileWeb(blob, filename, extension)
    : saveBlobToFileDesktop(blob, filename, extension);

