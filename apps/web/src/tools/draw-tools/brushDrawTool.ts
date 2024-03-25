import type { DrawPayload, DrawTool, DrawToolMetadata } from "./drawTool";
import type { CanvasContext, Position } from "@/utils/common";
import { getTranslations } from "@/translations";

const translations = getTranslations().tools.draw.brush;

export const brushDrawToolMetadata: DrawToolMetadata = {
  id: "brush",
  name: translations.name,
  icon: "brush",
  settings: {
    color: {
      name: translations.settings.color,
      type: "color",
      default: "#17548B",
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
      ],
    },
  },
} as const;

type BrushDrawToolSettings = {
  color: string;
  size: number;
};

export class BrushDrawTool implements DrawTool {
  private previousPosition: Position | null = null;

  constructor(private context: CanvasContext) {}

  configure(settings: BrushDrawToolSettings): void {
    const { size, color } = settings;
    this.context.lineWidth = size;
    this.context.strokeStyle = color;
    this.context.lineCap = "round";
  }

  draw(payload: DrawPayload) {
    if (this.previousPosition) {
      this.context.beginPath();
      this.context.moveTo(this.previousPosition.x, this.previousPosition.y);
      this.context.lineTo(payload.position.x, payload.position.y);
      this.context.stroke();
    }

    this.previousPosition = payload.position;
  }

  reset() {
    this.previousPosition = null;
  }
}
