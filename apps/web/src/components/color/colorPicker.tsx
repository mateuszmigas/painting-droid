import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HsvWheel } from "./hsvWheel";
import { HsValueSlider } from "./hsValueSlider";
import { AlphaSlider } from "./alphaSlider";
import { OptionSetting } from "../tool-settings/optionSetting";
import type { RgbaColor, HsvaColor, HsColor } from "@/utils/color";
import { useStableCallback } from "@/hooks";
import { ColorRectangle } from "./colorRectangle";
import { ColorProcessor } from "@/utils/colorProcessor";
import { ColorInputs } from "./colorInputs";
import { cn } from "@/utils/css";

const predefined = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff"];

export const ColorPicker = (props: {
  className?: string;
  // color: RgbaColor;
  // onChange: (color: RgbaColor) => void;
}) => {
  const { className } = props;
  const [color, setColor] = useState<HsvaColor>({
    h: 45,
    s: 100,
    v: 100,
    a: 1,
  });

  const setHsColor = useStableCallback((newColor: HsColor) => {
    setColor((oldColor) => ({
      ...oldColor,
      ...newColor,
    }));
  });

  const setRgbaColor = useStableCallback((newColor: RgbaColor) => {
    setColor((oldColor) => ({
      ...oldColor,
      ...ColorProcessor.fromRgba(newColor).toHsva(),
    }));
  });

  return (
    <Popover open>
      <PopoverTrigger>
        <ColorRectangle
          className={cn("w-10 h-6", className)}
          color={ColorProcessor.fromHsva(color).toRgba()}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col gap-big w-fit">
        <div className="flex flex-row gap-big">
          <div className="flex flex-row h-[136px] relative gap-big">
            <HsvWheel
              className="size-[136px]"
              color={color}
              setColor={setHsColor}
            />
            <HsValueSlider
              className="h-full"
              color={color}
              value={color.v}
              onChange={(v) => setColor((oldColor) => ({ ...oldColor, v }))}
            />
            <AlphaSlider
              className="h-full"
              color={color}
              value={color.a * 100}
              onChange={(a) =>
                setColor((oldColor) => ({ ...oldColor, a: a / 100 }))
              }
            />
            <ColorInputs
              className="w-[120px]"
              color={ColorProcessor.fromHsva(color).toRgba()}
              onChange={setRgbaColor}
            />
          </div>
        </div>
        <div className="flex flex-row gap-medium">
          {predefined.map((predef, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-md border ${
                index === 0 ? "border-primary" : ""
              }`}
              style={{
                backgroundColor: predef,
              }}
            />
          ))}
          <OptionSetting
            className="w-20"
            value="1"
            onChange={() => {}}
            options={[
              { label: "Theme 1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
            ]}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

