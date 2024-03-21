// import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

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

