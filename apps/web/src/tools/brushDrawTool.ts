import type {
  CanvasTool,
  CanvasToolEvent,
  CanvasToolMetadata,
} from "./canvasTool";
import type { CanvasBitmapContext, Color } from "@/utils/common";
import { getTranslations } from "@/translations";
import { ColorProcessor } from "@/utils/colorProcessor";

const translations = getTranslations().tools.draw.brush;

export const brushDrawToolMetadata: CanvasToolMetadata = {
  id: "brush",
  name: translations.name,
  icon: "brush",
  settings: {
    color: {
      name: translations.settings.color,
      type: "color",
      default: { r: 23, b: 139, g: 84, a: 1 },
    },
    size: {
      name: translations.settings.size,
      type: "size",
      default: 3,
      options: [
        { value: 1, label: "1px" },
        { value: 3, label: "3px" },
        { value: 5, label: "5px" },
        { value: 10, label: "10px" },
        { value: 20, label: "20px" },
        { value: 50, label: "50px" },
      ],
    },
  },
} as const;

type BrushDrawToolSettings = {
  color: Color;
  size: number;
};

export class BrushDrawTool implements CanvasTool {
  private onCommitCallback: (() => void) | null = null;

  constructor(private bitmapContext: CanvasBitmapContext) {}

  configure(settings: BrushDrawToolSettings): void {
    const { size, color } = settings;
    this.bitmapContext.lineWidth = size;
    this.bitmapContext.strokeStyle =
      ColorProcessor.fromRgba(color).toRgbaString();
    this.bitmapContext.lineCap = "round";
    this.bitmapContext.lineJoin = "round";
  }

  processEvent(event: CanvasToolEvent): void {
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

