import type { Rectangle } from "@/utils/common";
import type { CanvasShape, CanvasShapeId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

const translate = (type: CanvasShape["type"]) => {
  if (type === "captured-rectangle") {
    return translations.canvasActions.transformShape.capturedRectangle;
  }
  return translations.general.unknown;
};

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: { shapeId: CanvasShapeId; boundingBox: Rectangle }
): Promise<CanvasAction> => {
  const { shapeId, boundingBox } = payload;
  const state = context.getState();
  const previousBoundingBox = state.shapes[shapeId].boundingBox;

  const capturedData = {
    previousBoundingBox,
    newBoundingBox: boundingBox,
  };

  return {
    display: translate(state.shapes[shapeId].type),
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

