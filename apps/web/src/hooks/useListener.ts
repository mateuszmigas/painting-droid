import { Observable } from "@/utils/observable";
import { useStableCallback } from ".";
import { useEffect } from "react";

export const useListener = <T>(
  observable: Observable<T>,
  onChange: (value: T) => void
) => {
  const stableOnChange = useStableCallback(onChange);

  useEffect(() => {
    const unsubscribe = observable.subscribe(stableOnChange);
    return () => unsubscribe();
  }, []);
};

