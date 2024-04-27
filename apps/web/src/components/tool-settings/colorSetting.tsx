import type { Color } from "@/utils/common";
import { ColorPicker } from "../color/colorPicker";
import { cn } from "@/utils/css";

export const ColorSetting = (props: {
  value: Color;
  onChange: (newValue: Color) => void;
  className?: string;
}) => {
  const { value, onChange, className } = props;
  return (
    <ColorPicker
      value={value}
      onChange={onChange}
      className={cn("w-[40px] h-input-thin", className)}
    />
  );
};
