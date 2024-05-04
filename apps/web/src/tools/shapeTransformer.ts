import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { type Position, isPositionInRectangle } from "@/utils/common";
import { fastRound } from "@/utils/math";

export const isPositionInsideShape = (
  position: Position,
  shape: CanvasOverlayShape
) => {
  return isPositionInRectangle(position, shape.boundingBox);
};

export class ShapeTransformer {
  private target: CanvasOverlayShape | null = null;
  private startPosition: Position | null = null;
  private endPosition: Position | null = null;

  setTarget(target: CanvasOverlayShape | null) {
    this.target = target;
  }

  update(position: Position) {
    if (!this.target) {
      return;
    }

    if (!this.startPosition) {
      this.startPosition = {
        x: fastRound(position.x),
        y: fastRound(position.y),
      };
      return;
    }

    this.endPosition = {
      x: fastRound(position.x),
      y: fastRound(position.y),
    };
  }

  getShape() {
    if (!this.startPosition || !this.endPosition) {
      return this.target;
    }

    const distance = {
      x: this.endPosition.x - this.startPosition.x,
      y: this.endPosition.y - this.startPosition.y,
    };

    return {
      ...this.target,
      boundingBox: {
        ...this.target!.boundingBox,
        x: this.target!.boundingBox.x + distance.x,
        y: this.target!.boundingBox.y + distance.y,
      },
    };
  }

  reset() {
    this.startPosition = null;
    this.endPosition = null;
  }
}

