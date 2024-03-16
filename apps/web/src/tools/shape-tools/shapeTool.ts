import type { CanvasOverlayShape } from "@/canvas/canvasState";
import type { IconType } from "@/components/icon";
import type { Position } from "@/utils/common";

export type ShapePayload = {
  position: Position;
  isLastTick: boolean;
  sinceLastTickMs: number;
  ticksCount: number;
};

export type ShapeToolMetadata = {
  id: string;
  name: string;
  icon: IconType;
  settings: Record<
    string,
    {
      name: string;
      type: string;
      options?: Array<{ value: unknown; label: string }>;
    }
  >;
};

export interface ShapeTool {
  configure(config: unknown): void;
  update(payload: ShapePayload): CanvasOverlayShape | null;
  finish(): CanvasOverlayShape | null;
  reset(): void;
}

