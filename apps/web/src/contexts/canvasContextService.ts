import type { CanvasContext } from "@/utils/common";
import { createContext, useContext } from "react";

type CanvasContextStore = {
  activeContext: CanvasContext | null;
  setActiveContext: (context: CanvasContext) => void;
};

export const CanvasContextStoreContext = createContext<CanvasContextStore>(
  {} as CanvasContextStore
);

export const useCanvasContextStore = () =>
  useContext<CanvasContextStore>(CanvasContextStoreContext);

