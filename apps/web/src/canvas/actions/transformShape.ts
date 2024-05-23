import type { Rectangle } from "@/utils/common";
import type { CanvasShapeId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { shapeId: CanvasShapeId; boundingBox: Rectangle }
): Promise<CanvasAction> => {
  const { shapeId, boundingBox } = payload;
  const state = context.getState();
  const previousBoundingBox = state.shapes[shapeId].boundingBox;
  const shape = state.shapes[shapeId];

  if (!shape) {
    throw new Error("Shape not found");
  }

  const capturedData = {
    previousBoundingBox,
    newBoundingBox: boundingBox,
  };

  return {
    display: translations.shapesTransform[shape.type].transform,
    icon: "mouse-pointer-square-dashed",
    execute: async (state) => {
      return {
        ...state,
        shapes: {
          ...state.shapes,
          [shapeId]: {
            ...state.shapes[shapeId],
            boundingBox: capturedData.newBoundingBox,
          },
        },
      };
    },
    undo: async (state) => {
      return {
        ...state,
        shapes: {
          ...state.shapes,
          [shapeId]: {
            ...state.shapes[shapeId],
            boundingBox: capturedData.previousBoundingBox,
          },
        },
      };
    },
  };
};

