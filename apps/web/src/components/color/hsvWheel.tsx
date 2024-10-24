import type { HsColor } from "@/utils/color";
import type { Position } from "@/utils/common";
import { cn } from "@/utils/css";
import { memo, useEffect, useRef } from "react";

const hsToPosition = (hs: HsColor): Position => {
  const rotatedHue = hs.h - 90;
  const x = (Math.cos(rotatedHue * (Math.PI / 180)) * hs.s) / 100;
  const y = (Math.sin(rotatedHue * (Math.PI / 180)) * hs.s) / 100;
  return { x, y };
};

const positionToHs = (position: Position): HsColor => {
  const { x, y } = position;
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  const hue = (angle + 90 + 360) % 360;
  const saturation = Math.min(Math.sqrt(x * x + y * y), 1);
  return { h: hue, s: saturation * 100 };
};

export const HsvWheel = memo(
  (props: {
    color: HsColor;
    setColor: (color: HsColor) => void;
    className?: string;
  }) => {
    const { color, setColor, className } = props;
    const wheelRef = useRef<HTMLDivElement>(null);
    const isMovingThumb = useRef(false);

    useEffect(() => {
      if (!wheelRef.current) return;
      const wheel = wheelRef.current;

      const setColorFromEvent = (e: PointerEvent) => {
        const rect = wheel.getBoundingClientRect();
        const x = (e.clientX - rect.left) / (rect.width / 2) - 1;
        const y = (e.clientY - rect.top) / (rect.height / 2) - 1;
        setColor(positionToHs({ x, y }));
      };

      const onPointerDown = (e: PointerEvent) => {
        setColorFromEvent(e);
        isMovingThumb.current = true;
        e.preventDefault();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isMovingThumb.current) return;
        setColorFromEvent(e);
      };

      const onPointerUp = () => {
        isMovingThumb.current = false;
      };

      wheel.addEventListener("pointerdown", onPointerDown);
      wheel.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      return () => {
        wheel.removeEventListener("pointerdown", onPointerDown);
        wheel.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    }, [setColor]);

    const position = hsToPosition(color);

    return (
      <div className={cn("relative", className)}>
        <div className="absolute wheel-hsl size-full" />
        <div className="absolute rounded-full border size-full" />
        <div ref={wheelRef} className="absolute size-full">
          <div
            style={{
              left: `calc(50% + ${position.x * 50}%)`,
              top: `calc(50% + ${position.y * 50}%)`,
            }}
            className="pointer-events-none cursor-pointer -translate-x-1/2 -translate-y-1/2 absolute h-4 w-4 rounded-full border shadow-black/50 border-white shadow transition-colors"
          />
        </div>
      </div>
    );
  }
);
