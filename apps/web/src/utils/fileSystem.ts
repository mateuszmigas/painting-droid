import {
  saveTextToFile as saveTextToFileWeb,
  saveBlobToFile as saveBlobToFileWeb,
  openFile as openFileWeb,
  readFileAsDataURL as readFileAsDataURLWeb,
  readFileAsText as readFileAsTextWeb,
} from "./html";
import {
  saveTextToFile as saveTextToFileDesktop,
  saveBlobToFile as saveBlobToFileDesktop,
  openFile as openFileDesktop,
  readFileAsDataURL as readFileAsDataURLDesktop,
  readFileAsText as readFileAsTextDesktop,
} from "./tauriClient";
import { isWeb } from "./platform";

export const openFile = (options: {
  extensions: string[];
}): Promise<{ name: string; path: string } | null> =>
  isWeb() ? openFileWeb(options) : openFileDesktop(options);

export const readFileAsDataURL = (path: string) =>
  isWeb() ? readFileAsDataURLWeb(path) : readFileAsDataURLDesktop(path);

export const readFileAsText = (path: string) =>
  isWeb() ? readFileAsTextWeb(path) : readFileAsTextDesktop(path);

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

export const splitNameAndExtension = (name: string) => {
  const parts = name.split(".");
  const extension = parts.pop();
  const fileName = parts.join(".");
  return { fileName, extension };
};
