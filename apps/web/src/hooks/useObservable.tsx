import { useMemo } from "react";
import { Observable } from "@/utils/observable";

export const useObservable = <T,>(value: T) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  return useMemo(() => new Observable<T>(value), []);
};
