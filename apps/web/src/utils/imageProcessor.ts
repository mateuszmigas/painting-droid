import {
  restoreContextFromUncompressed,
  createCanvasContext,
  convertToBlob,
} from "./canvas";
import type { CanvasContext, Rectangle, Size } from "./common";
import { dataUrlToImage } from "./image";
import type { ImageCompressedData, ImageUncompressed } from "./imageData";

export class ImageProcessor {
  private context!: CanvasContext;
  private tasks: (() => Promise<void>)[] = [];

  private constructor(contextFactory: () => Promise<CanvasContext>) {
    this.tasks.push(async () => {
      const context = await contextFactory();
      this.context = context;
    });
  }

  public static fromContext(context: CanvasContext) {
    return new ImageProcessor(() => Promise.resolve(context));
  }

  public static fromCompressedData(imageData: ImageCompressedData) {
    return new ImageProcessor(async () => {
      const image = await createImageBitmap(imageData);
      const { width, height } = image;
      const context = createCanvasContext(width, height);
      context.drawImage(image, 0, 0, width, height);
      return context;
    });
  }

  public static fromMergedCompressed(
    imagesData: ImageCompressedData[],
    size: Size
  ) {
    return new ImageProcessor(async () => {
      const { width, height } = size;
      const context = createCanvasContext(width, height);
      for (const imageData of imagesData) {
        const image = await createImageBitmap(imageData);
        context.drawImage(image, 0, 0, width, height);
      }
      return context;
    });
  }

  public static fromUncompressed(image: ImageUncompressed) {
    return new ImageProcessor(() => {
      const context = createCanvasContext(image.width, image.height);
      restoreContextFromUncompressed(context, image);
      return Promise.resolve(context);
    });
  }

  public static fromCropContext(context: CanvasContext, rectangle: Rectangle) {
    return new ImageProcessor(async () => {
      const { x, y, width, height } = rectangle;
      const data = context.getImageData(x, y, width, height);
      const cropContext = createCanvasContext(width, height);
      cropContext.putImageData(data, 0, 0);
      return cropContext;
    });
  }

  public static fromBase64(base64: string) {
    return new ImageProcessor(async () => {
      const response = await fetch(`data:image/jpeg;base64,${base64}`);
      const blob = await response.blob();
      const image = await createImageBitmap(blob);
      const context = createCanvasContext(image.width, image.height);
      context.drawImage(image, 0, 0);
      return context;
    });
  }

  public static fromDataUrl(dataUrl: string) {
    return new ImageProcessor(async () => {
      const image = await dataUrlToImage(dataUrl);
      const context = createCanvasContext(image.width, image.height);
      context.drawImage(image, 0, 0);
      return context;
    });
  }

  public static fromBlob(blob: Blob) {
    return new ImageProcessor(async () => {
      const imageBitmap = await createImageBitmap(blob);
      const context = createCanvasContext(
        imageBitmap.width,
        imageBitmap.height
      );
      context.drawImage(imageBitmap, 0, 0);
      return context;
    });
  }

  public static fromEmpty(width: number, height: number) {
    return new ImageProcessor(async () => createCanvasContext(width, height));
  }

  useContext(callback: (context: CanvasContext) => Promise<void>) {
    this.tasks.push(() => callback(this.context!));
    return this;
  }

  crop(rectangle: Rectangle) {
    this.tasks.push(async () => {
      const { x, y, width, height } = rectangle;
      const data = this.context.getImageData(x, y, width, height);
      const cropContext = createCanvasContext(width, height);
      cropContext.putImageData(data, 0, 0);
      this.context = cropContext;
    });
    return this;
  }

  async toCompressed() {
    await this.runTasks();
    const { width, height } = this.context.canvas;
    const blob = await convertToBlob(this.context, "image/png");
    return { width, height, data: blob! };
  }

  async toCompressedData() {
    await this.runTasks();
    return convertToBlob(this.context, "image/png")!;
  }

  async toContext() {
    await this.runTasks();
    return this.context!;
  }

  async toImageData() {
    await this.runTasks();
    return this.context!.getImageData(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  }

  async toBlob(format: "jpeg" | "png") {
    await this.runTasks();
    return convertToBlob(this.context, `image/${format}`);
  }

  private async runTasks() {
    for (const task of this.tasks) {
      await task();
    }
  }
}
