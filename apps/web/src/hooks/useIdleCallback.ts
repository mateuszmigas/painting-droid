import { useEffect } from "react";
import { useStableCallback } from "./useStableCallback";

export const useIdleCallback = (callback: () => void) => {
  const stableCallback = useStableCallback(callback);
  useEffect(() => {
    requestIdleCallback(() => stableCallback());
  }, [stableCallback]);
};

