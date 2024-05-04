import type { CanvasVectorContext, Position } from "@/utils/common";

import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { fastRound } from "@/utils/math";
import { getTranslations } from "@/translations";
import { uuid } from "@/utils/uuid";
import type {
  CanvasTool,
  CanvasToolEvent,
  CanvasToolMetadata,
  CanvasToolResult,
} from "./canvasTool";

const translations = getTranslations().tools.shape.rectangleSelect;

export const rectangleSelectToolMetadata: CanvasToolMetadata = {
  id: "rectangleSelect",
  name: translations.name,
  icon: "rectangle-select",
  settings: {},
} as const;

const minSize = 1;

export class RectangleSelectTool implements CanvasTool {
  private startPosition: Position | null = null;
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;
  private shape: CanvasOverlayShape | null = null;

  constructor(private vectorContext: CanvasVectorContext) {}

  configure(_: unknown): void {}

  processEvent(event: CanvasToolEvent) {
    if (event.type === "manipulationStart") {
      this.startPosition = {
        x: fastRound(event.position.x),
        y: fastRound(event.position.y),
      };
      this.shape = {
        id: uuid(),
        type: "rectangle",
        boundingBox: { x: 0, y: 0, width: 0, height: 0 },
        captured: null,
      };
    }

    if (!this.startPosition || !this.shape) {
      throw new Error("RectangleSelectTool: start or shape not set");
    }

    const endPosition = {
      x: fastRound(event.position.x),
      y: fastRound(event.position.y),
    };

    const x = Math.min(this.startPosition.x, endPosition.x);
    const y = Math.min(this.startPosition.y, endPosition.y);
    const width = Math.max(
      Math.abs(this.startPosition.x - endPosition.x),
      minSize
    );
    const height = Math.max(
      Math.abs(this.startPosition.y - endPosition.y),
      minSize
    );
    this.shape.boundingBox = { x, y, width, height };
    this.vectorContext.render(this.shape);

    if (event.type === "manipulationEnd") {
      this.onCommitCallback?.({ shape: this.shape });
    }
  }

  onCommit(callback: (result: CanvasToolResult) => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    this.startPosition = null;
  }
}

