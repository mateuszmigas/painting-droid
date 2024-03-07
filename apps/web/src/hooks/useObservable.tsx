import { Observable } from "@/utils/observable";
import { useMemo } from "react";

export const useObservable = <T,>(value: T) =>
  useMemo(() => new Observable<T>(value), []);

