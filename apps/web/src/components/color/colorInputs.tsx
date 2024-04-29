import { isValidHex, type RgbaColor } from "@/utils/color";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { memo, useState } from "react";
import { getTranslations } from "@/translations";
import { cn } from "@/utils/css";
import { NumberInput } from "../input/numberInput";
import { ColorProcessor } from "@/utils/colorProcessor";
import { testIds } from "@/utils/testIds";
const translations = getTranslations().color;

export const ColorInputs = memo(
  (props: {
    color: RgbaColor;
    onChange: (color: RgbaColor) => void;
    className?: string;
  }) => {
    const { color, onChange, className } = props;
    const [hex, setHex] = useState<string>(
      ColorProcessor.fromRgba(color).toHex()
    );
    return (
      <div className={cn("flex flex-col gap-small", className)}>
        {Object.keys(color).map((key) => {
          const rgbaKey = key as keyof RgbaColor;
          const max = rgbaKey === "a" ? 1 : 255;
          const step = rgbaKey === "a" ? 0.01 : 1;
          return (
            <div
              key={rgbaKey}
              className="flex flex-row items-center gap-big justify-between"
            >
              <Label className="text-xs">
                {translations.rgba[rgbaKey as keyof typeof translations.rgba]}
              </Label>
              <NumberInput
                max={max}
                min={0}
                step={step}
                className="text-xs h-input-thin w-[70px] pr-small pl-medium"
                value={color[rgbaKey]}
                onChange={(value) =>
                  onChange({
                    ...color,
                    [rgbaKey]: Math.max(0, Math.min(max, value)),
                  })
                }
              />
            </div>
          );
        })}
        <div className="flex flex-row items-center gap-big justify-between">
          <Label className="text-xs">{translations.hex}</Label>
          <Input
            data-testid={testIds.colorPickerHexInput}
            className="text-xs h-input-thin w-[70px] pr-small pl-medium"
            value={hex}
            onChange={(e) => {
              const value = e.target.value;
              setHex(value);
              isValidHex(value) &&
                onChange(ColorProcessor.fromHex(value).toRgba());
            }}
            onBlur={(e) => {
              const value = e.target.value;
              !isValidHex(value) &&
                setHex(ColorProcessor.fromRgba(color).toHex());
            }}
          />
        </div>
      </div>
    );
  }
);

