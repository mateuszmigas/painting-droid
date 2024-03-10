import { debounce } from "@/utils/function";
import { useMountedRef } from "./useMountedRef";
import { useStableCallback } from ".";

export const useDebounce = <T, A>(callback: (...args: A[]) => T, delay: number) => {
  const mounted = useMountedRef();
  return useStableCallback(debounce((...args: A[]) => mounted.current && callback(...args), delay));
};
