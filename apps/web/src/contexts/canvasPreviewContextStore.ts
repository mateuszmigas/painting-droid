import type { CanvasContext } from "@/utils/common";
import { createContext, useContext } from "react";

type CanvasPreviewContextStore = {
  previewContext: CanvasContext | null;
  setPreviewContext: (context: CanvasContext) => void;
};

export const CanvasPreviewContextStoreContext =
  createContext<CanvasPreviewContextStore>({} as CanvasPreviewContextStore);

export const useCanvasPreviewContextStore = () =>
  useContext<CanvasPreviewContextStore>(CanvasPreviewContextStoreContext);
