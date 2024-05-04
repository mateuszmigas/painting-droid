import type { CanvasOverlayShape } from "@/canvas/canvasState";
import type { IconType } from "@/components/icons/icon";
import type { Position } from "@/utils/common";

export type CanvasToolSettingType = "color" | "size";

export type CanvasToolMetadata = {
  id: string;
  name: string;
  icon: IconType;
  settings: Record<
    string,
    {
      name: string;
      type: CanvasToolSettingType;
      default: unknown;
      options?: Array<{ value: unknown; label: string }>;
    }
  >;
};

export type CanvasToolEvent =
  | { type: "manipulationStart"; position: Position }
  | { type: "manipulationStep"; position: Position }
  | { type: "manipulationEnd"; position: Position };

export type CanvasToolResult = {
  shape?: CanvasOverlayShape;
};

export interface CanvasTool {
  configure(settings: unknown): void;
  processEvent(event: CanvasToolEvent): void;
  onCommit(callback: (result?: CanvasToolResult) => void): void;
  reset(): void;
}

