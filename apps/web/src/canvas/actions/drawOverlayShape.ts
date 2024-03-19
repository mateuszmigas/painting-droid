import type { CanvasOverlayShape } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: {
    overlayShape: CanvasOverlayShape | null;
  }
): CanvasAction => {
  const { overlayShape } = payload;
  const state = context.getState();
  const previousOverlayShape = state.overlayShape;

  const capturedData = {
    previousOverlayShape,
    newOverlayShape: overlayShape,
  };

  return {
    display: "Update Overlay Shape",
    icon: "pencil",
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
