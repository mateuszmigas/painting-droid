import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HsvWheel } from "./hsvWheel";
import { HsValueSlider } from "./hsValueSlider";
import { AlphaSlider } from "./alphaSlider";
import {
  type RgbaColor,
  type HsvaColor,
  calculateTextColor,
} from "@/utils/color";
import { useStableCallback } from "@/hooks";
import { ColorButton } from "./colorButton";
import { ColorProcessor } from "@/utils/colorProcessor";
import { ColorInputs } from "./colorInputs";
import { cn } from "@/utils/css";
import { ThemesColorGrid } from "./color-grids/themesGrid";
import { RecentColorGrid } from "./color-grids/recentGrid";
import { FavoriteColorGrid } from "./color-grids/favoriteGrid";
import { IconButton } from "../icons/iconButton";
import { useSettingsStore } from "@/store";

export const CustomColorPicker = (props: {
  value: RgbaColor;
  onChange: (color: RgbaColor) => void;
  title: string;
  className?: string;
}) => {
  const { value, onChange, title, className } = props;
  const rgbaColor = value;
  const hsvaColor = ColorProcessor.fromRgba(value).toHsva();
  const { addFavoriteColor, addRecentColor } = useSettingsStore();

  const setHsvaColor = useStableCallback((newColor: Partial<HsvaColor>) => {
    const newHsva = { ...hsvaColor, ...newColor };
    onChange(ColorProcessor.fromHsva(newHsva).toRgba());
  });

  const setRgbaColor = useStableCallback((newColor: Partial<RgbaColor>) => {
    onChange({ ...rgbaColor, ...newColor });
  });

  return (
    <Popover onOpenChange={(open) => !open && addRecentColor(rgbaColor)}>
      <PopoverTrigger asChild title={title}>
        <ColorButton
          className={cn("w-10 h-6", className)}
          color={ColorProcessor.fromHsva(hsvaColor).toRgba()}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col gap-big w-[350px]">
        <div className="flex flex-col gap-big">
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
          <div className="flex flex-row gap-big h-[70px] w-full">
            <div className="relative flex-1">
              <ColorButton className="absolute size-full" color={rgbaColor} />
              <div
                style={{ color: calculateTextColor(rgbaColor) }}
                className="absolute size-full flex items-end justify-end p-small"
              >
                <IconButton
                  type="star"
                  size={"small"}
                  onClick={() => addFavoriteColor(rgbaColor)}
                />
              </div>
            </div>
            <FavoriteColorGrid className="flex-1" onSelected={setRgbaColor} />
            <RecentColorGrid className="flex-1" onSelected={setRgbaColor} />
            <ThemesColorGrid className="flex-1" onSelected={setRgbaColor} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
