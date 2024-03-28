import { open, save } from "@tauri-apps/plugin-dialog";
import {
  writeTextFile,
  writeFile,
  readTextFile,
  readFile,
} from "@tauri-apps/plugin-fs";
import { getTranslations } from "@/translations";
import { splitNameAndExtension } from "./fileSystem";

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

export const openFile = async (options: {
  extensions: string[];
}): Promise<{ name: string; path: string } | null> => {
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
  return {
    name: file.name!,
    path: file.path,
  };
};

export const readFileAsText = (path: string) => {
  return readTextFile(path);
};

export const readFileAsDataURL = async (path: string) => {
  const { extension } = splitNameAndExtension(path);
  const bytes = await readFile(path);
  const dataUrl = await bytesToBase64(bytes);
  return `data:image/${extension};base64,${dataUrl}`;
};

export const saveTextToFile = async (
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

export const saveBlobToFile = async (
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
