import type { CanvasBitmapContext, CanvasVectorContext } from "@/utils/common";
import { getTranslations } from "@/translations";
import {
  createCanvasToolMetadata,
  type CanvasTool,
  type CanvasToolEvent,
  type CanvasToolResult,
} from "./canvasTool";
import { getPixelColor, selectMask } from "@/utils/imageOperations";
import { areColorsClose } from "@/utils/color";
import { canvasShapeToShapes2d } from "@/utils/shapeConverter";
import type { CanvasShape } from "@/canvas/canvasState";

const translations = getTranslations().tools.magicWandSelect;

class MagicWandSelectTool implements CanvasTool<never> {
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;

  constructor(
    private bitmapContext: CanvasBitmapContext,
    private vectorContext: CanvasVectorContext
  ) {}

  configure(_: never): void {}

  processEvent(event: CanvasToolEvent) {
    if (event.type !== "pointerDown") {
      return;
    }
    const imageData = this.bitmapContext.getImageData(
      0,
      0,
      this.bitmapContext.canvas.width,
      this.bitmapContext.canvas.height
    );

    const position = {
      x: ~~event.canvasPosition.x,
      y: ~~event.canvasPosition.y,
    };
    const originColor = getPixelColor(position, imageData);
    const fillMask = selectMask(imageData, position, (color) =>
      areColorsClose(color, originColor, 0.5)
    )!;

    const shape: CanvasShape = {
      id: "123",
      type: "captured-mask",
      boundingBox: {
        x: 0,
        y: 0,
        width: imageData.width,
        height: imageData.height,
      },
      imageMask: fillMask.getData(),
    };

    this.vectorContext.render("tool", canvasShapeToShapes2d(shape));

    // const fillData = fillMask.getData();

    // for (let maskIndex = 0; maskIndex < fillData.length; maskIndex++) {
    //   if (fillData[maskIndex]) {
    //     const imageIndex = maskIndex * 4;
    //     imageData.data[imageIndex] = 255;
    //     imageData.data[imageIndex + 1] = 0;
    //     imageData.data[imageIndex + 2] = 0;
    //     imageData.data[imageIndex + 3] = 255;
    //   }
    // }

    // imageData.data.set(imageData.data);
    // this.bitmapContext.putImageData(imageData, 0, 0);
    this.onCommitCallback?.({ bitmapContextChanged: true });
  }

  onCommit(callback: (result: CanvasToolResult) => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    // this.startCanvasPosition = null;
  }
}

export const magicWandSelectToolMetadata = createCanvasToolMetadata({
  id: "magicWandSelect",
  name: translations.name,
  icon: "wand-sparkles",
  settingsSchema: {},
  create: (context) => new MagicWandSelectTool(context.bitmap, context.vector),
});

