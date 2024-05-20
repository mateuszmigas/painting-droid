import { spreadOmitKeys } from "@/utils/object";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext
): Promise<CanvasAction> => {
  const state = context.getState();
  const previousActiveShapeId = state.activeShapeId;

  if (!previousActiveShapeId) {
    throw new Error("No active shape");
  }

  const previousActiveShape = state.shapes[previousActiveShapeId];

  const capturedData = {
    previousActiveShape,
    previousActiveShapeId,
  };

  return {
    display: translations.canvasActions.deselect,
    icon: "deselect",
    execute: async (state) => {
      return {
        ...state,
        shapes: spreadOmitKeys(state.shapes, [
          capturedData.previousActiveShapeId,
        ]),
        activeShapeId: null,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        shapes: {
          ...state.shapes,
          [capturedData.previousActiveShapeId]:
            capturedData.previousActiveShape,
        },
        activeShapeId: previousActiveShapeId,
      };
    },
  };
};
