import type { IconType } from "@/components/icon";
import type { Position } from "@/utils/common";

export type DrawPayload = {
  position: Position;
  sinceLastTickMs: number;
  ticksCount: number;
};

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

export interface DrawTool {
  configure(config: unknown): void;
  draw(payload: DrawPayload): void;
  reset(): void;
}
