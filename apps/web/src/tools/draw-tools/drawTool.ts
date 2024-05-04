import type { CanvasOverlayShape } from "@/canvas/canvasState";
import type { IconType } from "@/components/icons/icon";
import type { Position } from "@/utils/common";

export type DrawToolSettingType = "color" | "size";

export type DrawToolMetadata = {
  id: string;
  name: string;
  icon: IconType;
  settings: Record<
    string,
    {
      name: string;
      type: DrawToolSettingType;
      default: unknown;
      options?: Array<{ value: unknown; label: string }>;
    }
  >;
};

export type DrawToolEvent =
  | { type: "manipulationStart"; position: Position }
  | { type: "manipulationStep"; position: Position }
  | { type: "manipulationEnd"; position: Position };

export type DrawToolResult = {
  shape?: CanvasOverlayShape;
};

export interface DrawTool {
  configure(settings: unknown): void;
  processEvent(event: DrawToolEvent): void;
  onCommit(callback: (result?: DrawToolResult) => void): void;
  reset(): void;
}

