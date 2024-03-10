import { useCallback, useRef } from "react";

//does not work with concurrent mode
export const useStableCallback = <T extends (...args: never[]) => unknown>(callback: T): T => {
  const callbackRef = useRef<T | null>(null);
  callbackRef.current = callback;

  return useCallback((...args: unknown[]) => callbackRef.current?.(...(args as never[])), []) as unknown as T;
};
