export const downloadAsFile = (data: string, filename: string) => {
  const anchor = document.createElement("a");
  anchor.href = data;
  anchor.download = filename;
  anchor.click();
};

export const readFileAsText = (blob: Blob) => {
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event?.target?.result as string);
    };
    reader.onerror = (event) => {
      reject(event?.target?.error);
    };
    reader.readAsText(blob);
  });
};

export const openFile = (options: { extension: string }) => {
  return new Promise<File>((resolve, reject) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = false;
    fileInput.accept = `.${options.extension}`;
    fileInput.addEventListener("change", (event) => {
      const e = event as unknown as {
        target: { files: FileList | null };
      };
      const result = e?.target?.files?.[0] || null;
      if (result) {
        resolve(result);
      } else {
        reject("No file selected");
      }
    });
    fileInput.click();
  });
};
