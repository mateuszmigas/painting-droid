import type { RgbaColor } from "@/utils/color";
import { NativeColorPicker } from "./nativeColorPicker";
import { CustomColorPicker } from "./customColorPicker";
import { features } from "@/contants";

export const ColorPicker = (props: {
  value: RgbaColor;
  onChange: (color: RgbaColor) => void;
  className?: string;
}) => {
  const { value, onChange, className } = props;
  return features.nativeColorPicker ? (
    <NativeColorPicker
      value={value}
      onChange={onChange}
      className={className}
    />
  ) : (
    <CustomColorPicker
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};

