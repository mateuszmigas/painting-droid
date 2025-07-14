import type { CanvasShape } from "@/canvas/canvasState";
import { getTranslations } from "@/translations";
import type { CanvasBitmapContext, CanvasVectorContext, Position } from "@/utils/common";
import { createRectangleFromPoints } from "@/utils/geometry";
import { ImageProcessor } from "@/utils/imageProcessor";
import { fastRound } from "@/utils/math";
import { canvasShapeToShapes2d } from "@/utils/shapeConverter";
import { uuid } from "@/utils/uuid";
import { validateShape } from "../utils/boundingBoxTransform";
import { type CanvasTool, type CanvasToolEvent, type CanvasToolResult, createCanvasToolMetadata } from "./canvasTool";

const translations = getTranslations().tools.rectangleSelect;

class RectangleSelectTool implements CanvasTool<never> {
  private startCanvasPosition: Position | null = null;
  private startScreenPosition: Position | null = null;
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;
  private shapeId = "";

  constructor(
    private bitmapContext: CanvasBitmapContext,
    private vectorContext: CanvasVectorContext,
  ) {}

  configure(_: never): void {}

  processEvent(event: CanvasToolEvent) {
    if (event.type === "pointerDown") {
      this.startCanvasPosition = {
        x: fastRound(event.canvasPosition.x),
        y: fastRound(event.canvasPosition.y),
      };
      this.startScreenPosition = event.screenPosition;
      this.shapeId = uuid();
      return;
    }

    if ((event.type === "pointerMove" || event.type === "pointerUp") && this.startCanvasPosition !== null) {
      const endCanvasPosition = {
        x: fastRound(event.canvasPosition.x),
        y: fastRound(event.canvasPosition.y),
      };
      const endScreenPosition = event.screenPosition;

      const boundingBox = createRectangleFromPoints(this.startCanvasPosition, endCanvasPosition);

      const shape: CanvasShape = {
        id: this.shapeId,
        type: "captured-rectangle",
        boundingBox,
        capturedArea: {
          box: boundingBox,
          data: null as never, //data will be set when the shape is committed
        },
      };

      const isValid = validateShape(boundingBox, this.startScreenPosition!, endScreenPosition);

      isValid && this.vectorContext.render("tool", canvasShapeToShapes2d(shape));

      if (event.type === "pointerUp") {
        if (isValid) {
          ImageProcessor.fromCropContext(this.bitmapContext, shape.boundingBox)
            .toCompressedData()
            .then((data) => {
              this.onCommitCallback?.({
                shape: { ...shape, capturedArea: { box: boundingBox, data } },
              });
            });
        }
        this.reset();
      }
    }
  }

  onCommit(callback: (result: CanvasToolResult) => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    this.startCanvasPosition = null;
  }
}

export const rectangleSelectToolMetadata = createCanvasToolMetadata({
  id: "rectangleSelect",
  name: translations.name,
  icon: "rectangle-select",
  settingsSchema: {},
  create: (context) => new RectangleSelectTool(context.bitmap, context.vector),
});
