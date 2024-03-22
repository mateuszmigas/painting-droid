import type { CanvasOverlayShape } from "@/canvas/canvasState";
import type { IconType } from "@/components/icons/icon";
import type { Position } from "@/utils/common";

export type ShapePayload = {
  position: Position;
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
  update(payload: ShapePayload): void;
  getShape(): CanvasOverlayShape | null;
  reset(): void;
}
