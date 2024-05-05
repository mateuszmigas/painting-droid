import { ColorSetting } from "./colorSetting";
import { OptionSetting } from "./optionSetting";
import type { RgbaColor } from "@/utils/color";
import type { CustomField } from "@/utils/customFieldsSchema";
import { RangeSetting } from "./rangeSettings";
import { memo } from "react";

export const ToolSetting = memo(
  (props: {
    customField: CustomField;
    value: unknown;
    onChange: (newValue: unknown) => void;
  }) => {
    const { customField, value, onChange } = props;
    const { type } = customField;

    if (type === "color") {
      return <ColorSetting value={value as RgbaColor} onChange={onChange} />;
    }
    if (type === "option-number" || type === "option-string") {
      return (
        <OptionSetting
          value={value as number}
          onChange={onChange}
          options={customField.options as { value: number; label: string }[]}
        />
      );
    }
    if (type === "range-number" || type === "range-percent") {
      return (
        <RangeSetting
          value={value as number}
          onChange={onChange}
          format={type === "range-percent" ? "percent" : "number"}
          min={customField.min}
          max={customField.max}
        />
      );
    }

    throw new Error(`Unsupported setting type: ${type}`);
  }
);

