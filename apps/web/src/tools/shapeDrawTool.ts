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
import { validateShape } from "@/utils/boundingBoxTransform";
import { canvasShapeToShapes2d } from "@/utils/shapeConverter";

const translations = getTranslations().tools.shapeDraw;

const settingsSchema = createCanvasToolSettingsSchema({
  type: {
    name: translations.settings.type.name,
    type: "option-string",
    defaultValue: "rectangle",
    options: [
      {
        value: "rectangle",
        label: translations.settings.type.options.rectangle,
      },
      { value: "ellipse", label: translations.settings.type.options.ellipse },
    ],
  },
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

type ShapeDrawToolSettings = InferToolSettings<typeof settingsSchema>;

class ShapeDrawTool implements CanvasTool<ShapeDrawToolSettings> {
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;
  private startCanvasPosition: Position | null = null;
  private startScreenPosition: Position | null = null;
  private endScreenPosition: Position | null = null;
  private shapeDraft: CanvasShape = {
    id: "",
    type: "drawn-rectangle",
    fill: { r: 0, g: 0, b: 0, a: 0 },
    stroke: { color: { r: 0, g: 0, b: 0, a: 0 }, width: 0 },
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
  };

  constructor(private vectorContext: CanvasVectorContext) {}

  configure(settings: ShapeDrawToolSettings): void {
    this.shapeDraft = {
      ...this.shapeDraft,
      type: `drawn-${settings.type}` as never,
      fill: settings.fillColor,
      stroke: { color: settings.strokeColor, width: settings.strokeWidth },
    };
  }

  processEvent(event: CanvasToolEvent): void {
    if (event.type === "pointerDown") {
      this.startCanvasPosition = {
        x: fastRound(event.canvasPosition.x),
        y: fastRound(event.canvasPosition.y),
      };
      this.startScreenPosition = event.screenPosition;
      this.shapeDraft = { ...this.shapeDraft, id: uuid() };
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
      this.endScreenPosition = event.screenPosition;

      const boundingBox = createRectangleFromPoints(
        this.startCanvasPosition,
        endCanvasPosition
      );

      this.shapeDraft = { ...this.shapeDraft, boundingBox };

      const isValid = validateShape(
        boundingBox,
        this.startScreenPosition!,
        this.endScreenPosition!
      );

      if (isValid) {
        this.vectorContext.render(
          "tool",
          canvasShapeToShapes2d(this.shapeDraft)
        );
      }

      if (event.type === "pointerUp") {
        if (isValid) {
          this.onCommitCallback?.({ shape: this.shapeDraft });
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

export const shapeDrawToolMetadata = createCanvasToolMetadata({
  id: "shapes",
  name: translations.name,
  icon: "shapes",
  settingsSchema,
  create: (context) => new ShapeDrawTool(context.vector),
});
