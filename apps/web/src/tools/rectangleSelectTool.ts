import type { CanvasVectorContext, Position } from "@/utils/common";
import { fastRound } from "@/utils/math";
import { getTranslations } from "@/translations";
import { uuid } from "@/utils/uuid";
import {
  createCanvasToolMetadata,
  type CanvasTool,
  type CanvasToolEvent,
  type CanvasToolResult,
} from "./canvasTool";
import type { CanvasShape } from "@/canvas/canvasState";
import { canvasShapeToShapes2d } from "../utils/shape";
import { createRectFromPoints, distanceBetweenPoints } from "@/utils/geometry";
const translations = getTranslations().tools.shape.rectangleSelect;

const minShapeSize = 1;
const minScreenDistanceToDraw = 5;

class RectangleSelectTool implements CanvasTool<never> {
  private startCanvasPosition: Position | null = null;
  private startScreenPosition: Position | null = null;
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;
  private shapeId = "";

  constructor(private vectorContext: CanvasVectorContext) {}

  configure(_: never): void {}

  processEvent(event: CanvasToolEvent) {
    if (
      event.type !== "pointerDown" &&
      event.type !== "pointerMove" &&
      event.type !== "pointerUp"
    ) {
      return;
    }

    if (event.type === "pointerDown") {
      this.startCanvasPosition = {
        x: fastRound(event.canvasPosition.x),
        y: fastRound(event.canvasPosition.y),
      };
      this.startScreenPosition = event.screenPosition;
      this.shapeId = uuid();
      return;
    }

    if (!this.startCanvasPosition) {
      return;
    }

    const endCanvasPosition = {
      x: fastRound(event.canvasPosition.x),
      y: fastRound(event.canvasPosition.y),
    };
    const endScreenPosition = event.screenPosition;

    const boundingBox = createRectFromPoints(
      this.startCanvasPosition,
      endCanvasPosition
    );

    const shape: CanvasShape = {
      id: this.shapeId,
      type: "captured-rectangle",
      boundingBox,
      capturedArea: {
        box: boundingBox,
        data: null as never, //data will be set when the shape is committed
      },
    };

    const hasValidSize =
      boundingBox.width >= minShapeSize && boundingBox.height >= minShapeSize;
    const hasValidScreenDistance =
      distanceBetweenPoints(this.startScreenPosition!, endScreenPosition) >
      minScreenDistanceToDraw;

    const isValid = hasValidSize && hasValidScreenDistance;
    isValid && this.vectorContext.render("tool", canvasShapeToShapes2d(shape));

    if (event.type === "pointerUp") {
      isValid && this.onCommitCallback?.({ shape: shape });
      this.startCanvasPosition = null;
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
  create: (context) => new RectangleSelectTool(context.vector),
});
