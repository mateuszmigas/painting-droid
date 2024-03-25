import type { DrawPayload, DrawTool, DrawToolMetadata } from "./drawTool";
import type { CanvasContext, Position } from "@/utils/common";
import { getTranslations } from "@/translations";

const translations = getTranslations().tools.draw.pencil;

export const pencilDrawToolMetadata: DrawToolMetadata = {
  id: "Pencil",
  name: translations.name,
  icon: "pencil",
  settings: {
    color: {
      name: translations.settings.color,
      type: "color",
      default: "#4BF3C8",
    },
  },
} as const;

type PencilDrawToolSettings = {
  color: string;
};

export class PencilDrawTool implements DrawTool {
  private previousPosition: Position | null = null;

  constructor(private context: CanvasContext) {}

  configure(settings: PencilDrawToolSettings): void {
    const { color } = settings;
    this.context.lineWidth = 1;
    this.context.strokeStyle = color;
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
