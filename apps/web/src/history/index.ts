import {
  ImageCompressedBuffer,
  ImageUncompressedBuffer,
  ImageUncompressedBufferRect,
} from "@/utils/imageData";

export type ImageChange =
  | {
      type: "chunk";
      data: ImageUncompressedBufferRect;
    }
  | {
      type: "full";
      data: ImageUncompressedBuffer;
    };

export class ImageHistory {
  private checkpoints: Record<number, ImageCompressedBuffer> = {};

  init(data?: ImageUncompressedBuffer) {}

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

  undo() {
    //pop from stack
    //apply to current
  }

  redo() {
    //pop from stack
    //apply to current
  }

  private compress(data: ImageUncompressedBuffer): ImageCompressedBuffer {
    return {
      width: data.width,
      height: data.height,
      data: data.data,
    };
  }
}

