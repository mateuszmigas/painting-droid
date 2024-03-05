import { Position } from "@/utils/common";

export type DrawToolEvent =
  | {
      type: "mouseDown";
      payload: { position: Position };
    }
  | {
      type: "mouseMove";
      payload: { position: Position };
    }
  | {
      type: "mouseUp";
      payload: { position: Position };
    };

