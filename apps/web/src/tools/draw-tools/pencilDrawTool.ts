import type { DrawTool, DrawToolEvent, DrawToolMetadata } from "./drawTool";
import type { CanvasRasterContext, Color, Position } from "@/utils/common";
import { getTranslations } from "@/translations";
import { ColorProcessor } from "@/utils/colorProcessor";

const translations = getTranslations().tools.draw.pencil;

export const pencilDrawToolMetadata: DrawToolMetadata = {
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

export class PencilDrawTool implements DrawTool {
  private previousPosition: Position | null = null;
  private onCommitCallback: (() => void) | null = null;

  constructor(private context: CanvasRasterContext) {}

  configure(settings: PencilDrawToolSettings): void {
    const { color } = settings;
    this.context.lineWidth = 1;
    this.context.strokeStyle = ColorProcessor.fromRgba(color).toRgbaString();
  }

  processEvent(event: DrawToolEvent) {
    if (this.previousPosition) {
      this.context.beginPath();
      this.context.moveTo(this.previousPosition.x, this.previousPosition.y);
      this.context.lineTo(event.position.x, event.position.y);
      this.context.stroke();
    }

    this.previousPosition = event.position;

    if (event.type === "manipulationEnd") {
      this.previousPosition = null;
      this.onCommitCallback?.();
    }
  }

  onCommit(callback: () => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    this.previousPosition = null;
  }
}

