import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = (
  context: CanvasActionContext
): CanvasAction => {
  const state = context.getState();
  const previousOverlayShape = state.overlayShape;

  const capturedData = {
    previousOverlayShape,
    newOverlayShape: null,
  };

  return {
    display: translations.canvasActions.deselect,
    icon: "deselect",
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
