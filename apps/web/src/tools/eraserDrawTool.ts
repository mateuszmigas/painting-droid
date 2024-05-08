import {
  type InferToolSettings,
  createCanvasToolSettingsSchema,
  type CanvasTool,
  type CanvasToolEvent,
  createCanvasToolMetadata,
} from "./canvasTool";
import type { CanvasBitmapContext, CanvasVectorContext } from "@/utils/common";
import { getTranslations } from "@/translations";

const translations = getTranslations().tools.draw.eraser;

const settingsSchema = createCanvasToolSettingsSchema({
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

type EraserDrawToolSettings = InferToolSettings<typeof settingsSchema>;

class EraserDrawTool implements CanvasTool<EraserDrawToolSettings> {
  private onCommitCallback: (() => void) | null = null;
  private isDrawing = false;

  constructor(
    private bitmapContext: CanvasBitmapContext,
    private vectorContext: CanvasVectorContext
  ) {}

  configure(settings: EraserDrawToolSettings): void {
    const { size } = settings;
    this.bitmapContext.lineWidth = size;
    this.bitmapContext.strokeStyle = "white";
    this.bitmapContext.lineCap = "round";
    this.bitmapContext.lineJoin = "round";
  }

  processEvent(event: CanvasToolEvent) {
    if (event.type === "pointerDown") {
      this.isDrawing = true;
      this.bitmapContext.save();
      this.bitmapContext.globalCompositeOperation = "destination-out";
      this.bitmapContext.beginPath();
      this.bitmapContext.moveTo(event.position.x, event.position.y);
      this.bitmapContext.lineTo(event.position.x, event.position.y);
      this.bitmapContext.stroke();
    }

    if (event.type === "pointerMove") {
      this.vectorContext.renderShapes([
        {
          type: "selection-circle",
          position: event.position,
          radius: this.bitmapContext.lineWidth / 2,
        },
      ]);

      if (this.isDrawing) {
        this.bitmapContext.lineTo(event.position.x, event.position.y);
        this.bitmapContext.stroke();
      }
    }

    if (event.type === "pointerUp" && this.isDrawing === true) {
      this.bitmapContext.closePath();
      this.bitmapContext.restore();
      this.onCommitCallback?.();
      this.isDrawing = false;
    }

    if (event.type === "pointerLeave") {
      this.vectorContext.renderShapes([]);
    }
  }

  onCommit(callback: () => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    this.isDrawing = false;
  }
}

export const eraserDrawToolMetadata = createCanvasToolMetadata({
  id: "eraser",
  name: translations.name,
  icon: "eraser",
  settingsSchema,
  create: (context) => new EraserDrawTool(context.bitmap, context.vector),
});

