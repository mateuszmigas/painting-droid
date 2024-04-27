import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HsvWheel } from "./hsvWheel";
import { HsValueSlider } from "./hsValueSlider";
import { AlphaSlider } from "./alphaSlider";
import type { RgbaColor, HsvaColor } from "@/utils/color";
import { useStableCallback } from "@/hooks";
import { ColorRectangle } from "./colorRectangle";
import { ColorProcessor } from "@/utils/colorProcessor";
import { ColorInputs } from "./colorInputs";
import { cn } from "@/utils/css";

export const ColorPicker = (props: {
  className?: string;
  value: RgbaColor;
  onChange: (color: RgbaColor) => void;
}) => {
  const { value, onChange, className } = props;
  const rgbaColor = value;
  const hsvaColor = ColorProcessor.fromRgba(value).toHsva();

  const setHsvaColor = useStableCallback((newColor: Partial<HsvaColor>) => {
    const newHsva = { ...hsvaColor, ...newColor };
    onChange(ColorProcessor.fromHsva(newHsva).toRgba());
  });

  const setRgbaColor = useStableCallback((newColor: Partial<RgbaColor>) => {
    onChange({ ...rgbaColor, ...newColor });
  });

  return (
    <Popover>
      <PopoverTrigger>
        <ColorRectangle
          className={cn("w-10 h-6", className)}
          color={ColorProcessor.fromHsva(hsvaColor).toRgba()}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col gap-big w-fit">
        <div className="flex flex-row gap-big">
          <div className="flex flex-row h-[136px] relative gap-big">
            <HsvWheel
              className="size-[136px]"
              color={hsvaColor}
              setColor={setHsvaColor}
            />
            <HsValueSlider
              className="h-full"
              color={hsvaColor}
              value={hsvaColor.v}
              onChange={(v) => setHsvaColor({ v })}
            />
            <AlphaSlider
              className="h-full"
              color={hsvaColor}
              value={hsvaColor.a * 100}
              onChange={(a) => setHsvaColor({ a: a / 100 })}
            />
            <ColorInputs
              className="w-[120px]"
              color={ColorProcessor.fromHsva(hsvaColor).toRgba()}
              onChange={setRgbaColor}
            />
          </div>
        </div>
        {/* <div className="flex flex-row gap-medium">
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
        </div> */}
      </PopoverContent>
    </Popover>
  );
};
