import { useEffect } from "react";
import type { Observable } from "@/utils/observable";
import { useStableCallback } from ".";

export const useListener = <T>(
  observable: Observable<T>,
  onChange: (value: T) => void,
  options?: {
    triggerOnMount?: boolean;
  },
) => {
  const stableOnChange = useStableCallback(onChange);

  useEffect(() => {
    const unsubscribe = observable.subscribe(stableOnChange);
    options?.triggerOnMount && stableOnChange(observable.getValue());
    return () => unsubscribe();
  }, [observable, stableOnChange, options?.triggerOnMount]);
};
