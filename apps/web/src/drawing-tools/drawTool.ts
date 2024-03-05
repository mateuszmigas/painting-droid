import { DrawPayload } from "./drawPayload";

export interface DrawingTool {
  configure(config: unknown): void;
  draw(payload: DrawPayload): void;
  reset(): void;
}

