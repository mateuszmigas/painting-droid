import { open, save } from "@tauri-apps/plugin-dialog";
import {
  writeTextFile,
  writeFile,
  readTextFile,
  readFile,
} from "@tauri-apps/plugin-fs";
import { getTranslations } from "@/translations";
import type { PlatformFileSystem } from "./platformFileSystem";
import { splitNameAndExtension } from "../path";
import type { FilePath } from "../common";

const translations = getTranslations();

const bytesToBase64 = (buffer: Uint8Array) => {
  return new Promise<string>((resolve) => {
    const blob = new Blob([buffer], {
      type: "application/octet-binary",
    });
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      resolve(dataUrl.substr(dataUrl.indexOf(",") + 1));
    };
    reader.readAsDataURL(blob);
  });
};

const openFile = async (options: {
  extensions: string[];
}): Promise<FilePath | null> => {
  const file = await open({
    multiple: false,
    directory: false,
    filters: [
      { name: translations.general.images, extensions: options.extensions },
    ],
  });
  if (!file) {
    return null;
  }
  return file;
};

const readFileAsText = (path: string) => {
  return readTextFile(path);
};

const readFileAsDataURL = async (path: string) => {
  const { extension } = splitNameAndExtension(path);
  const bytes = await readFile(path);
  const dataUrl = await bytesToBase64(bytes);
  return `data:image/${extension};base64,${dataUrl}`;
};

const saveTextToFile = async (
  text: string,
  filename: string,
  extension: string
) => {
  const path = await save({
    filters: [{ name: filename, extensions: [extension] }],
  });
  if (!path) {
    return;
  }
  return writeTextFile(path, text);
};

const saveBlobToFile = async (
  blob: Blob,
  filename: string,
  extension: string
) => {
  const path = await save({
    filters: [{ name: filename, extensions: [extension] }],
  });
  if (!path) {
    return;
  }
  const arrayBuffer = await blob.arrayBuffer();
  return writeFile(path, new Uint8Array(arrayBuffer));
};

export const desktopFileSystem: PlatformFileSystem = {
  openFile,
  readFileAsDataURL,
  readFileAsText,
  saveTextToFile,
  saveBlobToFile,
};

