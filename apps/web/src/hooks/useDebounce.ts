import { debounce } from "@/utils/function";
import { useStableCallback } from ".";
import { useMountedRef } from "./useMountedRef";

export const useDebounce = <T, A>(callback: (...args: A[]) => T, delay: number) => {
  const mounted = useMountedRef();
  return useStableCallback(debounce((...args: A[]) => mounted.current && callback(...args), delay));
};
