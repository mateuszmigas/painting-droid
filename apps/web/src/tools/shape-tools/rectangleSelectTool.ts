import type { Position } from "@/utils/common";
import type { ShapePayload, ShapeTool, ShapeToolMetadata } from "./shapeTool";
import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { fastRound } from "@/utils/math";

export const rectangleSelectToolMetadata: ShapeToolMetadata = {
  id: "rectangleSelect",
  name: "Rectangle Select",
  icon: "rectangle-select",
  settings: {},
} as const;

export class RectangleSelectTool implements ShapeTool {
  private startPosition: Position | null = null;
  private endPosition: Position | null = null;

  update(payload: ShapePayload) {
    if (!this.startPosition) {
      this.startPosition = {
        x: fastRound(payload.position.x),
        y: fastRound(payload.position.y),
      };
    }

    this.endPosition = {
      x: fastRound(payload.position.x),
      y: fastRound(payload.position.y),
    };
  }

  getShape() {
    if (!this.startPosition || !this.endPosition) {
      return null;
    }

    const x = Math.min(this.startPosition.x, this.endPosition.x);
    const y = Math.min(this.startPosition.y, this.endPosition.y);
    const width = Math.abs(this.startPosition.x - this.endPosition.x);
    const height = Math.abs(this.startPosition.y - this.endPosition.y);

    if (width === 0 || height === 0) {
      return null;
    }

    return {
      type: "rectangle",
      boundingBox: { x, y, width, height },
      captured: null,
    } as CanvasOverlayShape;
  }

  reset() {
    this.startPosition = null;
    this.endPosition = null;
  }
}
