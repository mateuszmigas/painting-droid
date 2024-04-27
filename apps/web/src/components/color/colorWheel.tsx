import type { HslColor } from "@/utils/color";
import type { Position } from "@/utils/common";
import { memo, useEffect, useRef } from "react";

const hslToPosition = (hsl: HslColor): Position => {
  const rotatedHue = hsl.h - 90;
  const x = (Math.cos(rotatedHue * (Math.PI / 180)) * hsl.s) / 100;
  const y = (Math.sin(rotatedHue * (Math.PI / 180)) * hsl.s) / 100;
  return { x, y };
};

const positionToHsl = (position: Position): HslColor => {
  const { x, y } = position;
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  const hue = (angle + 90 + 360) % 360;
  const saturation = Math.min(Math.sqrt(x * x + y * y), 1);
  return { h: hue, s: saturation * 100, l: 50 };
};

export const ColorWheel = memo(
  (props: { color: HslColor; setColor: (color: HslColor) => void }) => {
    const { color, setColor } = props;
    const wheelRef = useRef<HTMLDivElement>(null);
    const isMoving = useRef(false);

    useEffect(() => {
      if (!wheelRef.current) return;
      const wheel = wheelRef.current;

      const setColorFromEvent = (e: PointerEvent) => {
        const rect = wheel.getBoundingClientRect();
        const x = (e.clientX - rect.left) / (rect.width / 2) - 1;
        const y = (e.clientY - rect.top) / (rect.height / 2) - 1;
        const hsl = positionToHsl({ x, y });
        setColor(hsl);
      };

      const onPointerDown = (e: PointerEvent) => {
        setColorFromEvent(e);
        isMoving.current = true;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isMoving.current) return;
        setColorFromEvent(e);
      };

      const onPointerUp = () => {
        isMoving.current = false;
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

    const position = hslToPosition(color);

    return (
      <div className="w-32 h-32 relative">
        <div className="absolute wheel-hsl size-full" />
        <div className="absolute rounded-full border size-full" />
        <div ref={wheelRef} className="absolute size-full">
          <div
            style={{
              left: `calc(50% + ${position.x * 50}%)`,
              top: `calc(50% + ${position.y * 50}%)`,
            }}
            className="pointer-events-none -translate-x-1/2 -translate-y-1/2 absolute h-4 w-4 rounded-full border shadow-black/50 border-white shadow transition-colors"
          />
        </div>
      </div>
    );
  }
);
