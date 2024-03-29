import type { PlatformFileSystem } from "./platformFileSystem";

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

const openFile = (options: { extensions: string[] }) => {
  return new Promise<{ name: string; path: string } | null>((resolve) => {
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
        resolve({
          name: result.name,
          path: URL.createObjectURL(result),
        });
      } else {
        resolve(null);
      }
    });
    fileInput.click();
  });
};

const downloadAsFile = (data: string, filename: string) => {
  const anchor = document.createElement("a");
  anchor.href = data;
  anchor.download = filename;
  anchor.click();
};

const saveTextToFile = async (
  text: string,
  filename: string,
  extension: string
) => {
  const blob = new Blob([text], { type: "text/plain" });
  downloadAsFile(URL.createObjectURL(blob), `${filename}.${extension}`);
};

const saveBlobToFile = async (
  blob: Blob,
  filename: string,
  extension: string
) => {
  const url = URL.createObjectURL(blob);
  downloadAsFile(url, `${filename}.${extension}`);
};

export const webFileSystem: PlatformFileSystem = {
  openFile,
  readFileAsDataURL,
  readFileAsText,
  saveTextToFile,
  saveBlobToFile,
};

