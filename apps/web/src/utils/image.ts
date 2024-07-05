import type { BoundingBox } from "./common";
import type { ImageUncompressed } from "./imageData";

export const dataUrlToImage = (dataUrl: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = dataUrl;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
  });
};

export const dataUrlToBlob = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

export const fileToBlob = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return new Blob([arrayBuffer], { type: file.type });
};

export const base64ToBlob = async (
  base64: string,
  format: "image/jpeg" | "image/png" = "image/png"
) => {
  const response = await fetch(`data:${format};base64,${base64}`);
  return await response.blob();
};

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

export const blobToBase64 = async (blob: Blob) => {
  const dataUrl = await blobToDataUrl(blob);
  return dataUrl.split(",")[1];
};

export const calculateFilledBoundingBox = (
  imageData: ImageUncompressed
): BoundingBox => {
  const { width, height, data } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let maskIndex = 0; maskIndex < data.length; maskIndex++) {
    const x = maskIndex % width;
    const y = Math.floor(maskIndex / width);

    if (data[maskIndex]) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

