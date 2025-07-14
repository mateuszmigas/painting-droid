import { type DependencyList, useEffect } from "react";
import { useStableCallback } from "./useStableCallback";

export const useAfterPaintEffect = (callback: () => void, deps: DependencyList = []) => {
  const stableCallback = useStableCallback(callback);
  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => stableCallback(), 0));
  }, [...deps, stableCallback]);
};
