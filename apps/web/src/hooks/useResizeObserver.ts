import type { Size } from "@/utils/common";
import { type RefObject, useEffect } from "react";

export const useResizeObserver = (ref: RefObject<HTMLElement>, onResize: (size: Size) => void) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        onResize({ width, height });
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [ref, onResize]);
};
