import { DrawPayload } from "./drawPayload";

export interface DrawingTool {
  draw(payload: DrawPayload): void;
  dispose(): void;
}

