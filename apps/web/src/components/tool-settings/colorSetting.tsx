import type { Color } from "@/utils/common";
import { cn } from "@/utils/css";
import { ColorPicker } from "../color/colorPicker";

export const ColorSetting = (props: {
  value: Color;
  onChange: (newValue: Color) => void;
  title: string;
  className?: string;
}) => {
  const { value, onChange, title, className } = props;
  return (
    <ColorPicker value={value} onChange={onChange} title={title} className={cn("w-[40px] h-input-thin", className)} />
  );
};
