import { DependencyList, EffectCallback, useEffect } from "react";

export const useAfterPaintEffect = (
  effect: EffectCallback,
  deps?: DependencyList
) =>
  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => effect(), 0));
  }, deps);

