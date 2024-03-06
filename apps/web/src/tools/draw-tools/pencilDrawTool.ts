import { DrawPayload, DrawTool, DrawToolMetadata } from "./drawTool";
import { CanvasContext, Position } from "@/utils/common";

export const pencilDrawToolMetadata: DrawToolMetadata = {
  id: "Pencil",
  name: "Pencil",
  icon: "pencil",
  settings: {
    color: {
      name: "Color",
      type: "color",
      default: "#4BF3C8",
    },
  },
} as const;

export type PencilDrawToolSettings = {
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

