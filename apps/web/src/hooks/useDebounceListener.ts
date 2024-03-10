import { useDebounce } from "./useDebounce";
import type { Observable } from "@/utils/observable";
import { useEffect } from "react";

export const useDebounceListener = <T>(
  observable: Observable<T>,
  onChange: (value: T) => void,
  delay: number
) => {
  const debounceOnChange = useDebounce(onChange, delay);
  useEffect(() => {
    const unsubscribe = observable.subscribe(debounceOnChange);
    return () => unsubscribe();
  }, [observable, debounceOnChange]);
};

