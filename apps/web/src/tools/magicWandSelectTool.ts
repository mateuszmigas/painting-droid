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
import { uuid } from "@/utils/uuid";
import { ImageProcessor } from "@/utils/imageProcessor";

const translations = getTranslations().tools.magicWandSelect;

class MagicWandSelectTool implements CanvasTool<never> {
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;

  constructor(
    private bitmapContext: CanvasBitmapContext,
    private vectorContext: CanvasVectorContext
  ) {}

  configure(_: never): void {}

  processEvent(event: CanvasToolEvent) {
    if (event.type !== "pointerUp") {
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

    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= imageData.width ||
      position.y >= imageData.height
    ) {
      return;
    }

    const originColor = getPixelColor(position, imageData);
    const fillMask = selectMask(imageData, position, (color) =>
      areColorsClose(color, originColor, 0.5)
    )!;

    const boundingBox = {
      x: 0,
      y: 0,
      width: imageData.width,
      height: imageData.height,
    };
    const shape: CanvasShape = {
      id: uuid(),
      type: "captured-rectangle",
      boundingBox,
      capturedArea: {
        box: boundingBox,
        data: null as never, //data will be set when the shape is committed
      },
    };

    this.vectorContext.render("tool", canvasShapeToShapes2d(shape));

    ImageProcessor.fromClonedContext(this.bitmapContext)
      .mask(fillMask)
      .toCompressedData()
      .then((data) => {
        this.onCommitCallback?.({
          shape: { ...shape, capturedArea: { box: boundingBox, data } },
        });
      });
  }

  onCommit(callback: (result: CanvasToolResult) => void) {
    this.onCommitCallback = callback;
  }

  reset() {}
}

export const magicWandSelectToolMetadata = createCanvasToolMetadata({
  id: "magicWandSelect",
  name: translations.name,
  icon: "wand-sparkles",
  settingsSchema: {},
  create: (context) => new MagicWandSelectTool(context.bitmap, context.vector),
});
