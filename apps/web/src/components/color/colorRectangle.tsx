import type { RgbaColor } from "@/utils/color";
import { ColorProcessor } from "@/utils/colorProcessor";
import { cn } from "@/utils/css";
import { memo } from "react";

export const ColorRectangle = memo(
  (props: { color: RgbaColor; onClick?: () => void; className?: string }) => {
    const { color, onClick, className } = props;
    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        className={cn("relative rounded-md border overflow-hidden", className)}
        onClick={onClick}
      >
        <div className="absolute size-full alpha-background rounded-md" />
        <div
          style={{
            background: `linear-gradient(to right, ${ColorProcessor.fromRgba(
              color
            ).toRgbString()} 25%,${ColorProcessor.fromRgba(
              color
            ).toRgbaString()})`,
          }}
          className="absolute size-full"
        />
      </div>
    );
  }
);

