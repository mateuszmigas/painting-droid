import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { createCanvasAction as clearActiveShape } from "./clearActiveShape";
import { createCanvasAction as applyActiveShape } from "./applyActiveShape";
import { areRectanglesEqual } from "@/utils/geometry";

export const createCanvasAction = async (
  context: CanvasActionContext
): Promise<CanvasAction> => {
  const state = context.getState();

  if (!state.activeShapeId) {
    throw new Error("No active shape");
  }

  const activeShape = state.shapes[state.activeShapeId];

  const shouldClear =
    activeShape.capturedArea &&
    areRectanglesEqual(activeShape.boundingBox, activeShape.capturedArea.box);

  return shouldClear ? clearActiveShape(context) : applyActiveShape(context);
};

