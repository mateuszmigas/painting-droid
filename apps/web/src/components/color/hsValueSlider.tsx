import * as SliderPrimitive from "@radix-ui/react-slider";
import { memo } from "react";
import type { HsvColor } from "@/utils/color";
import { ColorProcessor } from "@/utils/colorProcessor";
import { cn } from "@/utils/css";

export const HsValueSlider = memo(
  (props: {
    value: number;
    onChange: (value: number) => void;
    color: HsvColor;
    orientation?: "vertical" | "horizontal";
    className?: string;
  }) => {
    const { value, orientation = "vertical", onChange, color, className } = props;
    return (
      <SliderPrimitive.Root
        className={cn("relative flex h-full touch-none select-none items-center", className)}
        orientation={orientation}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={100}
        step={1}
      >
        <SliderPrimitive.Track
          style={
            {
              "--hsvalue-track-color": ColorProcessor.fromHsv({
                ...color,
                v: 100,
              }).toRgbString(),
            } as never
          }
          className="p-[7px] border relative h-full w-2.5 grow overflow-hidden rounded-full hsvalue-track"
        >
          <SliderPrimitive.Range />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border shadow-black/50 border-white shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring" />
      </SliderPrimitive.Root>
    );
  },
);
