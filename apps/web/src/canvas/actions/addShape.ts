import type { IconType } from "@/components/icons/icon";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { getTranslations } from "@/translations";
import type { CanvasShape } from "../canvasState";
import { spreadOmitKeys } from "@/utils/object";

const translations = getTranslations();

const translate = (shape: CanvasShape) => {
  if (shape?.type === "captured-rectangle") {
    return translations.canvasActions.addCapturedArea.rectangle;
  }
  return translations.general.unknown;
};

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
    display: display ?? translate(shape),
    icon: icon ?? "rectangle-select",
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

