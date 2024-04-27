import type { RgbaColor } from "@/utils/color";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { memo } from "react";
import { getTranslations } from "@/translations";
import { cn } from "@/utils/css";
import { NumberInput } from "../input/numberInput";
const translations = getTranslations().color;

export const ColorInputs = memo(
  (props: {
    color: RgbaColor;
    onChange: (color: RgbaColor) => void;
    className?: string;
  }) => {
    const { color, onChange, className } = props;
    return (
      <div className={cn("flex flex-col gap-small", className)}>
        {Object.keys(color).map((key) => {
          const rgbaKey = key as keyof RgbaColor;
          return (
            <div
              key={rgbaKey}
              className="flex flex-row items-center gap-big justify-between"
            >
              <Label className="text-xs">
                {translations.rgba[rgbaKey as keyof typeof translations.rgba]}
              </Label>
              <NumberInput
                max={255}
                min={0}
                className="text-xs h-input-thin w-16 pr-small"
                value={color[rgbaKey]}
                onChange={(value) =>
                  onChange({
                    ...color,
                    [rgbaKey]: Math.max(0, Math.min(255, value)),
                  })
                }
              />
            </div>
          );
        })}
        <div className="flex flex-row items-center gap-big">
          <Label className="text-xs w-10">Hex</Label>
          <Input
            className="text-xs h-input-thin w-16 text-right"
            defaultValue={132}
          />
        </div>
      </div>
    );
  }
);

