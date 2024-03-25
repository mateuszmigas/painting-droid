import { useEffect } from "react";
import { useStableCallback } from "./useStableCallback";

export const useIdleCallback = (callback: () => void) => {
  const stableCallback = useStableCallback(callback);
  useEffect(() => {
    //requestIdleCallback not supported in Safari
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => stableCallback());
    } else {
      setTimeout(() => stableCallback(), 0);
    }
  }, [stableCallback]);
};
