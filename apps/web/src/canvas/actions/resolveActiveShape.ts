import { areRectanglesEqual } from "@/utils/geometry";
import type { CanvasAction } from "./action";
import { createCanvasAction as applyActiveShape } from "./applyActiveShape";
import { createCanvasAction as clearActiveShape } from "./clearActiveShape";
import type { CanvasActionContext } from "./context";

export const createCanvasAction = async (context: CanvasActionContext): Promise<CanvasAction> => {
  const state = context.getState();

  if (!state.activeShapeId) {
    throw new Error("No active shape");
  }

  const activeShape = state.shapes[state.activeShapeId];

  const shouldClear =
    activeShape.capturedArea && areRectanglesEqual(activeShape.boundingBox, activeShape.capturedArea.box);

  return shouldClear ? clearActiveShape(context) : applyActiveShape(context);
};
