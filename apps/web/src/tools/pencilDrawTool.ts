import type {
  CanvasTool,
  CanvasToolEvent,
  CanvasToolMetadata,
} from "./canvasTool";
import type { CanvasBitmapContext, Color } from "@/utils/common";
import { getTranslations } from "@/translations";
import { ColorProcessor } from "@/utils/colorProcessor";

const translations = getTranslations().tools.draw.pencil;

export const pencilDrawToolMetadata: CanvasToolMetadata = {
  id: "Pencil",
  name: translations.name,
  icon: "pencil",
  settings: {
    color: {
      name: translations.settings.color,
      type: "color",
      default: { b: 200, g: 243, r: 75, a: 1 },
    },
  },
} as const;

type PencilDrawToolSettings = {
  color: Color;
};

export class PencilDrawTool implements CanvasTool {
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

