import type { RgbaColor } from "@/utils/color";
import { NativeColorPicker } from "./nativeColorPicker";
import { CustomColorPicker } from "./customColorPicker";
import { features } from "@/features";

export const ColorPicker = (props: {
  value: RgbaColor;
  onChange: (color: RgbaColor) => void;
  title: string;
  className?: string;
}) => {
  const { value, onChange, title, className } = props;
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
      title={title}
      className={className}
    />
  );
};
