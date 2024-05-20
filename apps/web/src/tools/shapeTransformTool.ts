import type { CanvasShape } from "@/canvas/canvasState";
import type { CanvasVectorContext, Position } from "@/utils/common";
import { arePointsClose, isPositionInRectangle } from "@/utils/geometry";
import { fastRound } from "@/utils/math";
import { canvasShapeToShapes2d } from "./utils";

export class ShapeTransformTool {
  private startPosition: Position | null = null;
  private endPosition: Position | null = null;
  private isTransforming = false;

  constructor(
    private vectorContext: CanvasVectorContext,
    private getActiveShape: () => CanvasShape | null
  ) {}

  getIsTransforming() {
    return this.isTransforming;
  }

  beginTransform(position: Position): boolean {
    const activeShape = this.getActiveShape();

    if (!activeShape) {
      return false;
    }

    if (isPositionInRectangle(position, activeShape.boundingBox)) {
      this.isTransforming = true;
      this.startPosition = {
        x: fastRound(position.x),
        y: fastRound(position.y),
      };
      return true;
    }

    return false;
  }

  stepTransform(position: Position) {
    this.endPosition = {
      x: fastRound(position.x),
      y: fastRound(position.y),
    };

    this.drawShape(this.transformShape());
  }

  commitTransform(): CanvasShape | false {
    this.isTransforming = false;
    if (!this.startPosition || !this.endPosition) {
      return false;
    }

    if (arePointsClose(this.startPosition, this.endPosition, 1)) {
      return false;
    }

    const shape = this.transformShape();
    this.drawShape(shape);
    return shape;
  }

  reset() {
    this.startPosition = null;
    this.endPosition = null;
    this.isTransforming = false;
  }

  private transformShape() {
    if (!this.startPosition || !this.endPosition) {
      throw new Error("start and end positions must be set");
    }
    const activeShape = this.getActiveShape()!;
    const distance = {
      x: this.endPosition.x - this.startPosition.x,
      y: this.endPosition.y - this.startPosition.y,
    };

    return {
      ...activeShape,
      boundingBox: {
        ...activeShape.boundingBox,
        x: activeShape.boundingBox.x + distance.x,
        y: activeShape.boundingBox.y + distance.y,
      },
    };
  }

  private drawShape = (shape: CanvasShape) => {
    this.vectorContext.render("tool", canvasShapeToShapes2d(shape));
  };
}

