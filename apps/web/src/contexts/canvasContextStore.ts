import type {
  CanvasBitmapContext,
  CanvasContext,
  CanvasVectorContext,
} from "@/utils/common";
import { createContext, useContext } from "react";

type CanvasPreviewContextStore = {
  context: CanvasContext;
  setBitmapContext: (context: CanvasBitmapContext) => void;
  setVectorContext: (context: CanvasVectorContext) => void;
};

export const CanvasPreviewContextStoreContext =
  createContext<CanvasPreviewContextStore>({} as CanvasPreviewContextStore);

export const useCanvasContextStore = () =>
  useContext<CanvasPreviewContextStore>(CanvasPreviewContextStoreContext);

