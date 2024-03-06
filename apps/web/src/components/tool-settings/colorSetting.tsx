import { Color } from "@/utils/common";
import { cn } from "@/utils/css";

export const ColorSetting = (props: {
  value: Color;
  onChange: (newValue: Color) => void;
  className?: string;
}) => {
  const { value, onChange, className } = props;
  return (
    <input
      name="color"
      className={cn("w-[40px] rounded-md h-input-thin", className)}
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    ></input>
  );
};

