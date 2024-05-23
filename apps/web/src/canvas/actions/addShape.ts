import type { IconType } from "@/components/icons/icon";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";
import type { CanvasShape } from "../canvasState";
import { spreadOmitKeys } from "@/utils/object";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: {
    shape: CanvasShape;
    display?: string;
    icon?: IconType;
  }
): Promise<CanvasAction> => {
  const { shape, display, icon } = payload;
  const state = context.getState();
  const previousActiveShapeId = state.activeShapeId;

  const capturedData = {
    previousActiveShapeId,
    nextActiveShapeId: shape.id,
    shape,
  };

  return {
    display: display || translations.shapesTransform[shape.type].add,
    icon:
      icon || shape.type.startsWith("drawn-") ? "shapes" : "rectangle-select",
    execute: async (state) => {
      return {
        ...state,
        shapes: {
          ...state.shapes,
          [capturedData.nextActiveShapeId]: capturedData.shape,
        },
        activeShapeId: capturedData.nextActiveShapeId,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        shapes: spreadOmitKeys(state.shapes, [capturedData.nextActiveShapeId]),
        activeShapeId: capturedData.previousActiveShapeId,
      };
    },
  };
};

