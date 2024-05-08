import type { IconType } from "@/components/icons/icon";
import type { CanvasCapturedArea } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

const translate = (shape: CanvasCapturedArea) => {
  if (shape?.type === "rectangle") {
    return translations.canvasActions.drawCapturedArea.rectangle;
  }
  return translations.general.unknown;
};

export const createCanvasAction = async (
  context: CanvasActionContext,
  payload: {
    capturedArea: CanvasCapturedArea;
    display?: string;
    icon?: IconType;
  }
): Promise<CanvasAction> => {
  const { capturedArea, display, icon } = payload;
  const state = context.getState();
  const previousCapturedArea = state.capturedArea;

  const capturedData = {
    previousCapturedArea,
    newCapturedArea: capturedArea,
  };

  return {
    display: display ?? translate(capturedArea),
    icon: icon ?? "rectangle-select",
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

