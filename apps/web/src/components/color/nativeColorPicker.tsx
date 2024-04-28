import type { RgbaColor } from "@/utils/color";
import { ColorProcessor } from "@/utils/colorProcessor";
import { cn } from "@/utils/css";

export const NativeColorPicker = (props: {
  value: RgbaColor;
  onChange: (color: RgbaColor) => void;
  className?: string;
}) => {
  const { value, onChange, className } = props;
  return (
    <input
      type="color"
      className={cn("bg-transparent", className)}
      value={ColorProcessor.fromRgba(value).toHex()}
      onChange={(e) =>
        onChange(ColorProcessor.fromHex(e.target.value).toRgba())
      }
    />
  );
};

