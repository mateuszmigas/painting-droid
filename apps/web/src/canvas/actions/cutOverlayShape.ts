import type { IconType } from "@/components/icons/icon";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: {
    display?: string;
    icon?: IconType;
  }
): CanvasAction => {
  const { display, icon } = payload;
  const state = context.getState();
  const previousOverlayShape = state.overlayShape;

  const capturedData = {
    previousOverlayShape,
    newOverlayShape: null,
  };

  return {
    display: display ?? translations.canvasActions.cutOverlayShape,
    icon: icon ?? "clipboard-cut",
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
