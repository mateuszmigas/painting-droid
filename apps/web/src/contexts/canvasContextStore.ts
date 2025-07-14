import { createContext, useContext } from "react";
import type { CanvasBitmapContext, CanvasContext, CanvasVectorContext } from "@/utils/common";

type CanvasPreviewContextStore = {
  context: CanvasContext;
  setBitmapContext: (context: CanvasBitmapContext) => void;
  setVectorContext: (context: CanvasVectorContext) => void;
};

export const CanvasPreviewContextStoreContext = createContext<CanvasPreviewContextStore>(
  {} as CanvasPreviewContextStore,
);

export const useCanvasContextStore = () => useContext<CanvasPreviewContextStore>(CanvasPreviewContextStoreContext);
