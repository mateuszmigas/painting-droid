import type { CanvasVectorContext, Position } from "@/utils/common";

import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { fastRound } from "@/utils/math";
import { getTranslations } from "@/translations";
import { uuid } from "@/utils/uuid";
import type {
  DrawTool,
  DrawToolEvent,
  DrawToolMetadata,
  DrawToolResult,
} from "./drawTool";

const translations = getTranslations().tools.shape.rectangleSelect;

export const rectangleSelectToolMetadata: DrawToolMetadata = {
  id: "rectangleSelect",
  name: translations.name,
  icon: "rectangle-select",
  settings: {},
} as const;

export class RectangleSelectTool implements DrawTool {
  private startPosition: Position | null = null;
  private endPosition: Position | null = null;
  private onCommitCallback: ((result: DrawToolResult) => void) | null = null;

  constructor(private canvasVectorContext: CanvasVectorContext) {}

  configure(_: unknown): void {}

  processEvent(event: DrawToolEvent) {
    if (!this.startPosition) {
      this.startPosition = {
        x: fastRound(event.position.x),
        y: fastRound(event.position.y),
      };
    }

    this.endPosition = {
      x: fastRound(event.position.x),
      y: fastRound(event.position.y),
    };

    const x = Math.min(this.startPosition.x, this.endPosition.x);
    const y = Math.min(this.startPosition.y, this.endPosition.y);
    const width = Math.abs(this.startPosition.x - this.endPosition.x);
    const height = Math.abs(this.startPosition.y - this.endPosition.y);

    if (width === 0 || height === 0) {
      return null;
    }

    const shape = {
      id: uuid(),
      type: "rectangle",
      boundingBox: { x, y, width, height },
      captured: null,
    } as CanvasOverlayShape;

    if (event.type !== "manipulationEnd") {
      this.canvasVectorContext.render(shape);
    } else {
      this.onCommitCallback?.({ shape });
    }
  }

  onCommit(callback: (result: DrawToolResult) => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    this.startPosition = null;
    this.endPosition = null;
  }
}

