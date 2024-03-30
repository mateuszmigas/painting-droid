import {
  restoreContextFromUncompressed,
  restoreContextFromCompressed,
  createCanvasContext,
} from "./canvas";
import type { CanvasContext, Rectangle } from "./common";
import { imageFromSrc } from "./image";
import type { ImageCompressedData, ImageUncompressedData } from "./imageData";

export class ImageProcessor {
  private context!: CanvasContext;
  private tasks: (() => Promise<void>)[] = [];

  private constructor(contextFactory: () => Promise<CanvasContext>) {
    this.tasks.push(async () => {
      const context = await contextFactory();
      this.context = context;
    });
  }

  public static processContext(context: CanvasContext) {
    return new ImageProcessor(() => Promise.resolve(context));
  }

  public static fromCompressed(image: ImageCompressedData) {
    return new ImageProcessor(async () => {
      const context = createCanvasContext(image.width, image.height);
      await restoreContextFromCompressed(context, image);
      return context;
    });
  }

  public static fromMergedCompressed(images: ImageCompressedData[]) {
    return new ImageProcessor(async () => {
      const { width, height } = images[0];
      const context = createCanvasContext(width, height);
      for (const compressed of images) {
        const image = await imageFromSrc(compressed.data);
        context.drawImage(image, 0, 0, width, height);
      }
      return context;
    });
  }

  public static fromUncompressed(image: ImageUncompressedData) {
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

  public static fromDataUrl(dataUrl: string) {
    return new ImageProcessor(async () => {
      const image = await imageFromSrc(dataUrl);
      const context = createCanvasContext(image.width, image.height);
      context.drawImage(image, 0, 0);
      return context;
    });
  }

  public static fromBlob(blob: Blob) {
    return new ImageProcessor(async () => {
      const dataUrl = URL.createObjectURL(blob);
      const image = await imageFromSrc(dataUrl);
      const context = createCanvasContext(image.width, image.height);
      context.drawImage(image, 0, 0);
      return context;
    });
  }

  useContext(callback: (context: CanvasContext) => Promise<void>) {
    this.tasks.push(() => callback(this.context!));
    return this;
  }

  async toCompressed() {
    await this.runTasks();
    const { width, height } = this.context.canvas;
    const data = this.context.canvas.toDataURL("image/png");
    return { width, height, data };
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

    const dataUrl = this.context.canvas.toDataURL(`image/${format}`, 1.0);
    const response = await fetch(dataUrl);
    return await response.blob();
  }

  private async runTasks() {
    for (const task of this.tasks) {
      await task();
    }
  }
}

