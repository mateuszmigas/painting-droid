import type { Size } from "@/utils/common";
import { type RefObject, useEffect, useMemo } from "react";

export const useCanvasStack = (
  hostElementRef: RefObject<HTMLElement>,
  size: Size
) => {
  const elements = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "canvas-renderer";
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.className =
      "pixelated-canvas pointer-events-none origin-top-left outline outline-border shadow-2xl box-content alpha-background";

    return [canvas];
  }, [size]);

  useEffect(() => {
    if (!hostElementRef.current) return;
    const hostElement = hostElementRef.current;
    const [canvas] = elements;
    hostElement.appendChild(canvas);

    return () => {
      hostElement.removeChild(canvas);
    };
  }, [elements, hostElementRef]);

  return elements;
};

