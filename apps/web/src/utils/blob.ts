export const arrayBufferToBlob = (buffer: ArrayBuffer, type = "image/png") => {
  return new Blob([buffer], { type });
};

export const blobToArrayBuffer = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(blob);
  });
};

export const blobToDataUrl = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      resolve(reader.result as string);
    });
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
  });
};

