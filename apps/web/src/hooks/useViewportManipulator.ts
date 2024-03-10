import { type Viewport, ViewportManipulator } from "@/utils/manipulation";
import { type RefObject, useEffect } from "react";
import { useStableCallback } from "./useStableCallback";

export const useViewportManipulator = (
  hostElementRef: RefObject<HTMLElement>,
  getCurrentViewport: () => Viewport,
  onViewportChange: (viewport: Viewport) => void
) => {
  const getCurrentViewportStable = useStableCallback(getCurrentViewport);
  const onViewportChangeStable = useStableCallback(onViewportChange);
  useEffect(() => {
    if (!hostElementRef.current) return;

    const manipulator = new ViewportManipulator(
      hostElementRef.current,
      getCurrentViewportStable,
      onViewportChangeStable
    );

    return () => manipulator.dispose();
  }, [
    getCurrentViewportStable,
    onViewportChangeStable,
    hostElementRef.current,
  ]);
};

