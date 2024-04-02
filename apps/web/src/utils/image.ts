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

export const base64ToBlob = async (
  base64: string,
  format: "image/jpeg" | "image/png" = "image/png"
) => {
  const response = await fetch(`data:${format};base64,${base64}`);
  return await response.blob();
};

export const dataUrlToBlob = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  return response.blob();
};
