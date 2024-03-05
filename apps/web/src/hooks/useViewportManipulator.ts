import { Viewport, ViewportManipulator } from "@/utils/manipulation";
import { RefObject, useEffect } from "react";

export const useViewportManipulator = (
  hostElementRef: RefObject<HTMLElement>,
  getCurrentViewport: () => Viewport,
  onViewportChange: (viewport: Viewport) => void
) => {
  useEffect(() => {
    if (!hostElementRef.current) return;

    const manipulator = new ViewportManipulator(
      hostElementRef.current,
      getCurrentViewport,
      onViewportChange
    );

    return () => manipulator.dispose();
  }, []);
};

