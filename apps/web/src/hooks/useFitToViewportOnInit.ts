import { Size } from "@/utils/common";
import { Viewport, calculateFitViewport } from "@/utils/manipulation";
import { RefObject, useEffect } from "react";

export const useFitToViewport = (
  hostElementRef: RefObject<HTMLElement>,
  size: Size,
  callback: (viewport: Viewport) => void
) => {
  useEffect(() => {
    if (!hostElementRef.current) return;

    const hostElement = hostElementRef.current;
    setTimeout(() => {
      const rect = hostElement.getBoundingClientRect();
      const margin = Math.min(rect.width, rect.height) * 0.1;
      const viewport = calculateFitViewport(
        rect,
        { x: 0, y: 0, ...size },
        margin
      );
      callback(viewport);
    }, 100);
  }, []);
};
