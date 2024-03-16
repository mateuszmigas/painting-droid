import type { CanvasContext } from "@/utils/common";
import type { ShapePayload, ShapeTool, ShapeToolMetadata } from "./shapeTool";
import type { CanvasOverlayShape } from "@/canvas/canvasState";

export const rectangleSelectToolMetadata: ShapeToolMetadata = {
  id: "rectangleSelect",
  name: "Rectangle Select",
  icon: "plus",
  settings: {},
} as const;

export class RectangleSelectTool implements ShapeTool {
  constructor(private context: CanvasContext) {
    console.log("context", this.context);
  }

  configure() {}

  update(payload: ShapePayload) {
    console.log("payload", payload);
    return {
      type: "rectangle",
      position: { x: 150, y: 10 },
      size: { width: 100, height: 120 },
      state: "draw",
    } as CanvasOverlayShape;
  }

  finish() {
    return null;
  }

  reset() {}
}

