import type { Color } from "@/utils/common";
import { ColorPicker } from "../color/colorPicker";

export const ColorSetting = (props: {
  value: Color;
  onChange: (newValue: Color) => void;
  className?: string;
}) => {
  const { value, onChange, className } = props;
  return (
    <ColorPicker value={value} onChange={onChange} className={className} />
  );
  // return (
  //   <input
  //     name="color"
  //     className={cn("w-[40px] rounded-md h-input-thin", className)}
  //     type="color"
  //     value={value}
  //     onChange={(e) => onChange(e.target.value)}
  //   />
  // );
};
