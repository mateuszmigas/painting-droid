import { DrawingTool } from "./drawTool";
import { PenToolConfig } from ".";
import { DrawPayload } from "./drawPayload";
import { DrawContext } from "./drawContext";
import { Position } from "@/utils/common";

export class PenDrawTool implements DrawingTool {
  private previousPosition: Position | null = null;
  constructor(private context: DrawContext) {}

  configure(settings: PenToolConfig["settings"]): void {
    const { size, color } = settings;
    this.context.lineWidth = size;
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

