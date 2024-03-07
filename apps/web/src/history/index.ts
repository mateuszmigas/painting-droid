import {
  ImageUncompressedData,
  ImageUncompressedRegionRect,
} from "@/utils/imageData";

export type ImageChange =
  | {
      type: "chunk";
      data: ImageUncompressedRegionRect;
    }
  | {
      type: "full";
      data: ImageUncompressedData;
    };

export class ImageHistory {
  private currentImage: ImageUncompressedData | null = null;

  init(data: ImageUncompressedData) {
    this.currentImage = data;
  }

  push(change: ImageChange) {
    //resets stack
    if (change.type === "chunk") {
      //store original chunks
    } else if (change.type === "full") {
      //compress current and use as checkpoint
    } else {
      throw new Error("Invalid change type");
    }
  }

  getCurrent() {
    if (!this.currentImage) throw new Error("No image");

    return this.currentImage;
  }

  undo() {
    //pop from stack
    //apply to current
  }

  redo() {
    //pop from stack
    //apply to current
  }

  //   private compress(data: ImageUncompressedBuffer): ImageCompressedBuffer {
  //     return {
  //       width: data.width,
  //       height: data.height,
  //       data: data.data,
  //     };
  //   }
}

