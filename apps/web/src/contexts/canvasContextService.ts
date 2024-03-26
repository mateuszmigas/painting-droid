import type { CanvasContext } from "@/utils/common";
import { createContext, useContext } from "react";

type CanvasContextStore = {
  getActiveContext: () => CanvasContext | null;
};

let canvasContext: CanvasContext | null = null;
export const setActiveCanvasContext = (context: CanvasContext) => {
  canvasContext = context;
};

export const canvasContextStore: CanvasContextStore = {
  getActiveContext: () => canvasContext,
};

export const CanvasContextStoreContext =
  createContext<CanvasContextStore>(canvasContextStore);

export const useCanvasContextStore = () =>
  useContext<CanvasContextStore>(CanvasContextStoreContext);

