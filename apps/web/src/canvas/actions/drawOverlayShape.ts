import type { CanvasOverlayShape } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

const translate = (shape: CanvasOverlayShape) => {
  if (shape?.type === "rectangle") {
    return translations.canvasActions.drawOverlayShape.rectangle;
  }
  return translations.general.unknown;
};

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: {
    overlayShape: CanvasOverlayShape;
    display?: string;
  }
): CanvasAction => {
  const { overlayShape, display: source } = payload;
  const state = context.getState();
  const previousOverlayShape = state.overlayShape;

  const capturedData = {
    previousOverlayShape,
    newOverlayShape: overlayShape,
  };

  return {
    display: source ?? translate(overlayShape),
    icon: "rectangle-select",
    execute: async (state) => {
      return {
        ...state,
        overlayShape: capturedData.newOverlayShape,
      };
    },
    undo: async () => {
      return {
        ...state,
        overlayShape: capturedData.previousOverlayShape,
      };
    },
  };
};
