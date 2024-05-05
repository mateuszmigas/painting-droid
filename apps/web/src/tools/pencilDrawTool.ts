import {
  type InferToolSettings,
  createCanvasToolMetadata,
  createCanvasToolSettingsSchema,
  type CanvasTool,
  type CanvasToolEvent,
} from "./canvasTool";
import type { CanvasBitmapContext } from "@/utils/common";
import { getTranslations } from "@/translations";
import { ColorProcessor } from "@/utils/colorProcessor";

const translations = getTranslations().tools.draw.pencil;

const settingsSchema = createCanvasToolSettingsSchema({
  color: {
    name: translations.settings.color,
    type: "color",
    defaultValue: { b: 200, g: 243, r: 75, a: 1 },
  },
});

type PencilDrawToolSettings = InferToolSettings<typeof settingsSchema>;

class PencilDrawTool implements CanvasTool<PencilDrawToolSettings> {
  private onCommitCallback: (() => void) | null = null;

  constructor(private bitmapContext: CanvasBitmapContext) {}

  configure(settings: PencilDrawToolSettings): void {
    const { color } = settings;
    this.bitmapContext.lineWidth = 1;
    this.bitmapContext.strokeStyle =
      ColorProcessor.fromRgba(color).toRgbaString();
  }

  processEvent(event: CanvasToolEvent) {
    if (event.type === "manipulationStart") {
      this.bitmapContext.beginPath();
      this.bitmapContext.moveTo(event.position.x, event.position.y);
      this.bitmapContext.lineTo(event.position.x, event.position.y);
      this.bitmapContext.stroke();
    }

    if (event.type === "manipulationStep") {
      this.bitmapContext.lineTo(event.position.x, event.position.y);
      this.bitmapContext.stroke();
    }

    if (event.type === "manipulationEnd") {
      this.bitmapContext.closePath();
      this.onCommitCallback?.();
    }
  }

  onCommit(callback: () => void) {
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

