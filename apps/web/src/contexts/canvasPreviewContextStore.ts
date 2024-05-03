import type { CanvasRasterContext, CanvasVectorContext } from "@/utils/common";
import { createContext, useContext } from "react";

type CanvasPreviewContextStore = {
  rasterContext: CanvasRasterContext | null;
  setRasterContext: (context: CanvasRasterContext) => void;
  vectorContext: CanvasVectorContext | null;
  setVectorContext: (context: CanvasVectorContext) => void;
};

export const CanvasPreviewContextStoreContext =
  createContext<CanvasPreviewContextStore>({} as CanvasPreviewContextStore);

export const useCanvasPreviewContextStore = () =>
  useContext<CanvasPreviewContextStore>(CanvasPreviewContextStoreContext);

