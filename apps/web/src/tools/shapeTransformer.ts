import type { CanvasCapturedArea } from "@/canvas/canvasState";
import type { Position } from "@/utils/common";
import { arePointsClose } from "@/utils/geometry";
import { fastRound } from "@/utils/math";

export class ShapeTransformer {
  private target: CanvasCapturedArea | null = null;
  private startPosition: Position | null = null;
  private endPosition: Position | null = null;

  setTarget(target: CanvasCapturedArea | null) {
    this.target = target;
  }

  transform(position: Position) {
    if (!this.startPosition) {
      this.startPosition = {
        x: fastRound(position.x),
        y: fastRound(position.y),
      };
    }

    this.endPosition = {
      x: fastRound(position.x),
      y: fastRound(position.y),
    };
  }

  getResult(): CanvasCapturedArea | false {
    if (!this.startPosition || !this.endPosition) {
      throw new Error("ShapeTransformer: getResult called before transform");
    }

    if (arePointsClose(this.startPosition, this.endPosition, 1)) {
      return false;
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
    } as CanvasCapturedArea;
  }

  reset() {
    this.startPosition = null;
    this.endPosition = null;
  }
}

