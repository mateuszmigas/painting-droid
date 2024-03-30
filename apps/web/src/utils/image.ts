export const imageFromSrc = (dataUrl: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = dataUrl;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
  });
};

