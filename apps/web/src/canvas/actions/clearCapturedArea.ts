import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = async (
  context: CanvasActionContext
): Promise<CanvasAction> => {
  const state = context.getState();
  const previousCapturedArea = state.capturedArea;

  const capturedData = {
    previousCapturedArea: previousCapturedArea,
    newCapturedArea: null,
  };

  return {
    display: translations.canvasActions.deselect,
    icon: "deselect",
    execute: async (state) => {
      return {
        ...state,
        capturedArea: capturedData.newCapturedArea,
      };
    },
    undo: async (state) => {
      return {
        ...state,
        capturedArea: capturedData.previousCapturedArea,
      };
    },
  };
};

