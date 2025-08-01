import { getTranslations } from "@/translations";
import { ColorProcessor } from "@/utils/colorProcessor";
import type { CanvasBitmapContext } from "@/utils/common";
import {
  type CanvasTool,
  type CanvasToolEvent,
  type CanvasToolResult,
  createCanvasToolMetadata,
  createCanvasToolSettingsSchema,
  type InferToolSettings,
} from "./canvasTool";

const translations = getTranslations().tools.pencilDraw;

const settingsSchema = createCanvasToolSettingsSchema({
  color: {
    name: translations.settings.color,
    type: "color",
    defaultValue: { b: 200, g: 243, r: 75, a: 1 },
  },
});

type PencilDrawToolSettings = InferToolSettings<typeof settingsSchema>;

class PencilDrawTool implements CanvasTool<PencilDrawToolSettings> {
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;
  private isDrawing = false;

  constructor(private bitmapContext: CanvasBitmapContext) {}

  configure(settings: PencilDrawToolSettings): void {
    const { color } = settings;
    this.bitmapContext.lineWidth = 1;
    this.bitmapContext.strokeStyle = ColorProcessor.fromRgba(color).toRgbaString();
  }

  processEvent(event: CanvasToolEvent) {
    if (event.type === "pointerDown") {
      this.isDrawing = true;
      this.bitmapContext.beginPath();
      this.bitmapContext.moveTo(event.canvasPosition.x, event.canvasPosition.y);
      this.bitmapContext.lineTo(event.canvasPosition.x, event.canvasPosition.y);
      this.bitmapContext.stroke();
    }

    if (event.type === "pointerMove" && this.isDrawing === true) {
      this.bitmapContext.lineTo(event.canvasPosition.x, event.canvasPosition.y);
      this.bitmapContext.stroke();
    }

    if (event.type === "pointerUp" && this.isDrawing === true) {
      this.bitmapContext.closePath();
      this.onCommitCallback?.({ bitmapContextChanged: true });
      this.isDrawing = false;
    }
  }

  onCommit(callback: (result: CanvasToolResult) => void) {
    this.onCommitCallback = callback;
  }

  reset() {}
}

export const pencilDrawToolMetadata = createCanvasToolMetadata({
  id: "Pencil",
  name: translations.name,
  icon: "pencil",
  settingsSchema,
  create: (context) => new PencilDrawTool(context.bitmap),
});
