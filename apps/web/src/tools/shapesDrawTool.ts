import {
  type CanvasToolResult,
  createCanvasToolMetadata,
  createCanvasToolSettingsSchema,
  type CanvasTool,
  type CanvasToolEvent,
  type InferToolSettings,
} from "./canvasTool";
import type { CanvasVectorContext, Position } from "@/utils/common";
import { getTranslations } from "@/translations";
import { fastRound } from "@/utils/math";
import { uuid } from "@/utils/uuid";
import type { CanvasShape } from "@/canvas/canvasState";
import { createRectangleFromPoints } from "@/utils/geometry";
import { canvasShapeToShapes2d, validateShape } from "@/utils/shape";
const translations = getTranslations().tools.draw.shape;

const settingsSchema = createCanvasToolSettingsSchema({
  fillColor: {
    name: translations.settings.fillColor,
    type: "color",
    defaultValue: { r: 23, b: 139, g: 84, a: 1 },
  },
  strokeColor: {
    name: translations.settings.strokeColor,
    type: "color",
    defaultValue: { r: 0, b: 0, g: 0, a: 1 },
  },
  strokeWidth: {
    name: translations.settings.strokeWidth,
    type: "option-number",
    defaultValue: 3,
    options: [
      { value: 1, label: "1px" },
      { value: 3, label: "3px" },
      { value: 5, label: "5px" },
    ],
  },
});

type ShapesDrawToolSettings = InferToolSettings<typeof settingsSchema>;

class ShapesDrawTool implements CanvasTool<ShapesDrawToolSettings> {
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;
  private settings: ShapesDrawToolSettings | null = null;
  private startCanvasPosition: Position | null = null;
  private startScreenPosition: Position | null = null;
  private shapeId = "";

  constructor(private vectorContext: CanvasVectorContext) {}

  configure(settings: ShapesDrawToolSettings): void {
    this.settings = settings;
  }

  processEvent(event: CanvasToolEvent): void {
    if (event.type === "pointerDown") {
      this.startCanvasPosition = {
        x: fastRound(event.canvasPosition.x),
        y: fastRound(event.canvasPosition.y),
      };
      this.startScreenPosition = event.screenPosition;
      this.shapeId = uuid();
      return;
    }

    if (
      (event.type === "pointerMove" || event.type === "pointerUp") &&
      this.startCanvasPosition !== null
    ) {
      const endCanvasPosition = {
        x: fastRound(event.canvasPosition.x),
        y: fastRound(event.canvasPosition.y),
      };
      const endScreenPosition = event.screenPosition;

      const boundingBox = createRectangleFromPoints(
        this.startCanvasPosition,
        endCanvasPosition
      );

      const settings = this.settings!;
      const shape: CanvasShape = {
        id: this.shapeId,
        type: "rectangle",
        boundingBox,
        fill: settings.fillColor,
        stroke: {
          color: settings.strokeColor,
          width: settings.strokeWidth,
        },
      };

      const isValid = validateShape(
        boundingBox,
        this.startScreenPosition!,
        endScreenPosition
      );

      isValid &&
        this.vectorContext.render("tool", canvasShapeToShapes2d(shape));

      if (event.type === "pointerUp") {
        isValid && this.onCommitCallback?.({ shape: shape });
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

export const shapesDrawToolMetadata = createCanvasToolMetadata({
  id: "shapes",
  name: translations.name,
  icon: "shapes",
  settingsSchema,
  create: (context) => new ShapesDrawTool(context.vector),
});

