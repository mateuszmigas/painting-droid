import { type RefObject, useEffect } from "react";
import type { Rectangle } from "@/utils/common";

export const useResizeObserver = (
  elementRefOrId: RefObject<HTMLElement> | string,
  onResize: (rectangle: Rectangle) => void,
) => {
  useEffect(() => {
    const element =
      typeof elementRefOrId === "string" ? document.getElementById(elementRefOrId) : elementRefOrId.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const { x, y } = element.getBoundingClientRect();
        onResize({ x, y, width, height });
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [elementRefOrId, onResize]);
};
