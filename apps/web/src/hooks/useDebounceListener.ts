import { useEffect } from "react";
import type { Observable } from "@/utils/observable";
import { useDebounce } from "./useDebounce";

export const useDebounceListener = <T>(observable: Observable<T>, onChange: (value: T) => void, delay: number) => {
  const debounceOnChange = useDebounce(onChange, delay);
  useEffect(() => {
    const unsubscribe = observable.subscribe(debounceOnChange);
    return () => unsubscribe();
  }, [observable, debounceOnChange]);
};
