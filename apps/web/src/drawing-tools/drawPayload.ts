import { Position } from "@/utils/common";

export type DrawPayload = {
  position: Position;
  isLastTick: boolean;
  sinceLastTickMs: number;
  ticksCount: number;
};

