import { DrawingTool } from "./drawTool";
import { PenToolConfig } from ".";
import { DrawPayload } from "./drawPayload";
import { DrawContext } from "./drawContext";

export class PenDrawTool implements DrawingTool {
  constructor(private config: PenToolConfig, private context: DrawContext) {}

  draw(payload: DrawPayload) {
    const size = this.config.settings.size;
    this.context.fillStyle = this.config.settings.color;
    this.context.fillRect(
      payload.position.x - size / 2,
      payload.position.y - size / 2,
      size,
      size
    );
  }

  dispose() {}
}

