import type { DrawPayload, DrawTool, DrawToolMetadata } from "./drawTool";
import type { CanvasContext, Position } from "@/utils/common";
import { getTranslations } from "@/translations";

const translations = getTranslations().tools.draw.eraser;

export const eraserDrawToolMetadata: DrawToolMetadata = {
  id: "eraser",
  name: translations.name,
  icon: "eraser",
  settings: {
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

type EraserDrawToolSettings = {
  size: number;
};

export class EraserDrawTool implements DrawTool {
  private previousPosition: Position | null = null;

  constructor(private context: CanvasContext) {}

  configure(settings: EraserDrawToolSettings): void {
    const { size } = settings;
    this.context.lineWidth = size;
    this.context.strokeStyle = "white";
    this.context.lineCap = "round";
  }

  draw(payload: DrawPayload) {
    if (this.previousPosition) {
      this.context.save();
      this.context.globalCompositeOperation = "destination-out";
      this.context.beginPath();
      this.context.moveTo(this.previousPosition.x, this.previousPosition.y);
      this.context.lineTo(payload.position.x, payload.position.y);
      this.context.stroke();
      this.context.restore();
    }

    this.previousPosition = payload.position;
  }

  reset() {
    this.previousPosition = null;
  }
}
