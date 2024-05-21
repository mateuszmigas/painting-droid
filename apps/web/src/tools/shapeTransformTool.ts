import type { CanvasShape } from "@/canvas/canvasState";
import type { CanvasVectorContext, Position } from "@/utils/common";
import { arePointsClose } from "@/utils/geometry";
import { fastRound } from "@/utils/math";
import {
  type TransformHandle,
  canvasShapeToShapes2d,
  getTransformHandle,
  transformBox,
} from "../utils/shape";

export class ShapeTransformTool {
  private startPosition: Position | null = null;
  private endPosition: Position | null = null;
  private transformHandle: TransformHandle | null = null;

  constructor(
    private vectorContext: CanvasVectorContext,
    private getActiveShape: () => CanvasShape | null
  ) {}

  isTransforming() {
    return this.transformHandle !== null;
  }

  beginTransform(canvasPosition: Position, screenPosition: Position): boolean {
    const activeShape = this.getActiveShape();

    if (!activeShape) {
      return false;
    }

    this.transformHandle = getTransformHandle(
      canvasPosition,
      screenPosition,
      activeShape.boundingBox
    );

    if (this.transformHandle) {
      this.startPosition = {
        x: fastRound(canvasPosition.x),
        y: fastRound(canvasPosition.y),
      };
    }

    return !!this.transformHandle;
  }

  stepTransform(position: Position) {
    this.endPosition = {
      x: fastRound(position.x),
      y: fastRound(position.y),
    };

    this.drawShape(this.transformShape());
  }

  commitTransform(): CanvasShape | false {
    const shape = this.transformShape();
    this.transformHandle = null;

    if (!this.startPosition || !this.endPosition) {
      return false;
    }

    if (arePointsClose(this.startPosition, this.endPosition, 1)) {
      return false;
    }

    this.drawShape(shape);
    return shape;
  }

  reset() {
    this.startPosition = null;
    this.endPosition = null;
    this.transformHandle = null;
  }

  private transformShape() {
    if (!this.startPosition || !this.endPosition) {
      throw new Error("start and end positions must be set");
    }
    const activeShape = this.getActiveShape()!;

    return {
      ...activeShape,
      boundingBox: transformBox(
        this.transformHandle!,
        activeShape.boundingBox,
        this.startPosition,
        this.endPosition
      ),
    };
  }

  private drawShape = (shape: CanvasShape) => {
    this.vectorContext.render("tool", canvasShapeToShapes2d(shape));
  };
}

