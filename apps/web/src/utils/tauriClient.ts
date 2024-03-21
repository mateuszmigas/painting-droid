// import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile, writeFile } from "@tauri-apps/plugin-fs";

export const openAndReadFileAsText = async (options: {
  extension: string;
}): Promise<{ name: string; text: string } | null> => {
  const file = await open({
    multiple: false,
    directory: false,
    filters: [{ name: options.extension, extensions: [options.extension] }],
  });
  if (!file) {
    return null;
  }
  const text = await readTextFile(file.path);
  return { name: file?.name ?? "Unknown", text };
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

