import { useEffect } from "react";
import { useStableCallback } from "./useStableCallback";

export const useAfterPaintEffect = (callback: () => void) => {
  const stableCallback = useStableCallback(callback);
  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => stableCallback(), 0));
  }, [stableCallback]);
};

