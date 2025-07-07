import { workspace } from "@/constants";
import type { PlatformFileSystem } from "./platformFileSystem";
import type { FilePath } from "../common";

declare global {
  interface Window {
    showOpenFilePicker: (options: {
      types: { accept: Record<string, string[]> }[];
      startIn: string;
    }) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker: (options: {
      suggestedName: string;
      types?: { accept: Record<string, string[]> }[];
    }) => Promise<FileSystemFileHandle>;
  }
}

const urlToBlob = async (url: string) => {
  const response = await fetch(url);
  return response.blob();
};

const readFileAsText = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event?.target?.result as string);
    };
    reader.onerror = (event) => {
      reject(event?.target?.error);
    };
    urlToBlob(url).then((blob) => reader.readAsText(blob));
  });
};

const readFileAsDataURL = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event?.target?.result as string);
    };
    reader.onerror = (event) => {
      reject(event?.target?.error);
    };
    urlToBlob(url).then((blob) => reader.readAsDataURL(blob));
  });
};

const openFile = async (options: { extensions: string[] }) => {
  if ("showOpenFilePicker" in window) {
    return openFileWithFileSystemApi(options);
  }
  return openFileWithInput(options);
};

const openFileWithFileSystemApi = async (options: { extensions: string[] }) => {
  try {
    const accept = options.extensions.reduce((acc, extension) => {
      const key =
        extension === workspace.format ? "text/plain" : `image/${extension}`;
      acc[key] = [`.${extension}`];
      return acc;
    }, {} as Record<string, string[]>);

    const [fileHandle] = await window.showOpenFilePicker({
      types: [{ accept }],
      startIn: "desktop",
    });
    return URL.createObjectURL(await fileHandle.getFile());
  } catch {
    return null;
  }
};

const openFileWithInput = async (options: { extensions: string[] }) => {
  return new Promise<FilePath | null>((resolve) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = false;
    fileInput.accept = options.extensions
      .map((extension) => `.${extension}`)
      .join(",");
    fileInput.addEventListener("change", (event) => {
      const e = event as unknown as {
        target: { files: FileList | null };
      };
      const result = e?.target?.files?.[0] || null;
      if (result) {
        resolve(URL.createObjectURL(result));
      } else {
        resolve(null);
      }
    });
    fileInput.click();
  });
};

const saveBlobWithAnchor = (
  blob: Blob,
  filename: string,
  extension: string
) => {
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `${filename}.${extension}`;
  anchor.click();
};

const saveBlobWithFileSystemApi = async (
  blob: Blob,
  filename: string,
  extension: string
) => {
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `${filename}.${extension}`,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch {
    //todo: maybe inform user that he didn't save the file
  }
};

const saveTextToFile = async (
  text: string,
  filename: string,
  extension: string
) => {
  const blob = new Blob([text], { type: "text/plain" });
  saveBlobToFile(blob, filename, extension);
};

const saveBlobToFile = async (
  blob: Blob,
  filename: string,
  extension: string
) => {
  if ("showSaveFilePicker" in window) {
    return saveBlobWithFileSystemApi(blob, filename, extension);
  }

  return saveBlobWithAnchor(blob, filename, extension);
};

export const webFileSystem: PlatformFileSystem = {
  openFile,
  readFileAsDataURL,
  readFileAsText,
  saveTextToFile,
  saveBlobToFile,
};
