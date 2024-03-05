import { Viewport, calculateFitViewport } from "@/utils/manipulation";
import { RefObject, useEffect } from "react";

export const useFitToViewport = (
  hostElementRef: RefObject<HTMLElement>,
  callback: (viewport: Viewport) => void
) => {
  useEffect(() => {
    if (!hostElementRef.current) return;

    const hostElement = hostElementRef.current;
    setTimeout(() => {
      const viewport = calculateFitViewport(
        hostElement.getBoundingClientRect(),
        { x: 0, y: 0, width: 800, height: 600 },
        50
      );
      callback(viewport);
    }, 0);
  }, []);
};

