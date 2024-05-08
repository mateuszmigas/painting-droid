import type { CanvasCapturedArea } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

const translate = (shape: CanvasCapturedArea) => {
  if (shape.type === "rectangle") {
    return translations.canvasActions.transformCapturedArea.rectangle;
  }
  return translations.general.unknown;
};

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: {
    capturedArea: CanvasCapturedArea;
  }
): Promise<CanvasAction> => {
  const { capturedArea } = payload;
  const state = context.getState();
  const previousCapturedArea = state.capturedArea;

  const capturedData = {
    previousCapturedArea,
    newCapturedArea: capturedArea,
  };

  return {
    display: translate(capturedArea),
    icon: "mouse-pointer-square-dashed",
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

