import type { Position } from "@/utils/common";
import { useEffect } from "react";
import { useStableCallback } from ".";

export const useMousePosition = (onChange: (position: Position) => void) => {
  const onChangeStable = useStableCallback(onChange);
  useEffect(() => {
    const handleMouseMove = (event: PointerEvent) =>
      onChangeStable({ x: event.clientX, y: event.clientY });

    document.addEventListener("pointermove", handleMouseMove, {
      capture: true,
    });

    return () => {
      document.removeEventListener("pointermove", handleMouseMove, {
        capture: true,
      });
    };
  }, [onChangeStable]);
};

