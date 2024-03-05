import { Size } from "@/utils/common";
import { Viewport, calculateFitViewport } from "@/utils/manipulation";
import { RefObject } from "react";
import { useAfterPaintEffect } from "./useAfterPaintEffect";

export const useFitCanvasToViewport = (
  hostElementRef: RefObject<HTMLElement>,
  size: Size,
  callback: (viewport: Viewport) => void
) =>
  useAfterPaintEffect(() => {
    if (!hostElementRef.current) return;

    const hostElement = hostElementRef.current;
    const rect = hostElement.getBoundingClientRect();
    const margin = Math.min(rect.width, rect.height) * 0.1;
    const viewport = calculateFitViewport(
      rect,
      { x: 0, y: 0, ...size },
      margin
    );
    callback(viewport);
  }, []);
