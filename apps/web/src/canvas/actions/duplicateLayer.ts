import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";
import { uuid } from "@/utils/uuid";
import type { CanvasLayerId } from "../canvasState";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): CanvasAction => {
  const { layerId } = payload;
  const state = context.getState();

  const capturedData = {
    sourceLayerId: layerId,
    targetLayerId: uuid(),
  };

  return {
    display: "Duplicate Layer",
    icon: "copy",
    execute: async (state) => {
      const index = state.layers.findIndex(
        (layer) => layer.id === capturedData.sourceLayerId
      );
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, index + 1),
          {
            ...state.layers[index],
            id: capturedData.targetLayerId,
            name: `${state.layers[index].name} copy`,
          },
          ...state.layers.slice(index + 1),
        ],
        activeLayerIndex: index + 1,
      };
    },
    undo: async () => {
      return {
        ...state,
        layers: state.layers.filter(
          (layer) => layer.id !== capturedData.targetLayerId
        ),
      };
    },
  };
};

