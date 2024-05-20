import {
  type CanvasToolResult,
  createCanvasToolMetadata,
  createCanvasToolSettingsSchema,
  type CanvasTool,
  type CanvasToolEvent,
  type InferToolSettings,
} from "./canvasTool";
import type { CanvasBitmapContext, CanvasVectorContext } from "@/utils/common";
import { getTranslations } from "@/translations";
import { ColorProcessor } from "@/utils/colorProcessor";

const translations = getTranslations().tools.draw.brush;

const settingsSchema = createCanvasToolSettingsSchema({
  color: {
    name: translations.settings.color,
    type: "color",
    defaultValue: { r: 23, b: 139, g: 84, a: 1 },
  },
  size: {
    name: translations.settings.size,
    type: "option-number",
    defaultValue: 3,
    options: [
      { value: 1, label: "1px" },
      { value: 3, label: "3px" },
      { value: 5, label: "5px" },
      { value: 10, label: "10px" },
      { value: 20, label: "20px" },
      { value: 50, label: "50px" },
    ],
  },
});

type BrushDrawToolSettings = InferToolSettings<typeof settingsSchema>;

class BrushDrawTool implements CanvasTool<BrushDrawToolSettings> {
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;
  private isDrawing = false;

  constructor(
    private bitmapContext: CanvasBitmapContext,
    private vectorContext: CanvasVectorContext
  ) {}

  configure(settings: BrushDrawToolSettings): void {
    const { size, color } = settings;
    this.bitmapContext.lineWidth = size;
    this.bitmapContext.strokeStyle =
      ColorProcessor.fromRgba(color).toRgbaString();
    this.bitmapContext.lineCap = "round";
    this.bitmapContext.lineJoin = "round";
  }

  processEvent(event: CanvasToolEvent): void {
    if (event.type === "pointerDown") {
      this.isDrawing = true;
      this.bitmapContext.beginPath();
      this.bitmapContext.moveTo(event.canvasPosition.x, event.canvasPosition.y);
      this.bitmapContext.lineTo(event.canvasPosition.x, event.canvasPosition.y);
      this.bitmapContext.stroke();
    }

    if (event.type === "pointerMove") {
      this.vectorContext.render("tool", [
        {
          type: "selection-circle",
          position: event.canvasPosition,
          radius: this.bitmapContext.lineWidth / 2,
        },
      ]);

      if (this.isDrawing) {
        this.bitmapContext.lineTo(
          event.canvasPosition.x,
          event.canvasPosition.y
        );
        this.bitmapContext.stroke();
      }
    }

    if (event.type === "pointerUp" && this.isDrawing === true) {
      this.bitmapContext.closePath();
      this.onCommitCallback?.({ bitmapContextChanged: true });
      this.isDrawing = false;
    }

    if (event.type === "pointerLeave") {
      this.vectorContext.clear("tool");
    }
  }

  onCommit(callback: (result: CanvasToolResult) => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    this.isDrawing = false;
  }
}

export const brushDrawToolMetadata = createCanvasToolMetadata({
  id: "brush",
  name: translations.name,
  icon: "brush",
  settingsSchema,
  create: (context) => new BrushDrawTool(context.bitmap, context.vector),
});

