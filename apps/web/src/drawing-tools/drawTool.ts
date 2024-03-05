import { DrawPayload } from "./drawPayload";

export interface Tool {}
export interface DrawingTool extends Tool {
  configure(config: unknown): void;
  draw(payload: DrawPayload): void;
  reset(): void;
}

