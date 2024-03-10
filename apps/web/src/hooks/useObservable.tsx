import { Observable } from "@/utils/observable";
import { useMemo } from "react";

export const useObservable = <T,>(value: T) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  return useMemo(() => new Observable<T>(value), []);
};

