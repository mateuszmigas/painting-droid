import type { RgbaColor } from "@/utils/color";
import { ColorProcessor } from "@/utils/colorProcessor";
import { cn } from "@/utils/css";
import { memo } from "react";

export const ColorRectangle = memo(
  (props: { color: RgbaColor; className?: string }) => {
    const { color, className } = props;
    return (
      <div
        className={cn(
          "relative alpha-background rounded-md border overflow-hidden",
          className
        )}
      >
        <div
          style={{
            background: ColorProcessor.fromRgba(color).toRgbaString(),
            opacity: color.a,
          }}
          className="absolute size-full"
        />
      </div>
    );
  }
);

