import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HsvWheel } from "./hsvWheel";
import { HsValueSlider } from "./hsValueSlider";
import { AlphaSlider } from "./alphaSlider";
import {
  type RgbaColor,
  type HsvaColor,
  calculateForegroundColor,
} from "@/utils/color";
import { useStableCallback } from "@/hooks";
import { useState, useEffect } from "react";
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
  const { value: propsValue, onChange, title, className } = props;
  const [hsva, setHsva] = useState<HsvaColor>(
    ColorProcessor.fromRgba(propsValue).toHsva()
  );
  const { addFavoriteColor, addRecentColor } = useSettingsStore();

  useEffect(() => {
    const currentRgbaFromInternalHsva = ColorProcessor.fromHsva(hsva).toRgba();
    if (ColorProcessor.equals(currentRgbaFromInternalHsva, propsValue)) {
      return;
    }

    const newHsvaFromProps = ColorProcessor.fromRgba(propsValue).toHsva();
    if (newHsvaFromProps.s === 0 || newHsvaFromProps.v === 0) {
      setHsva((prevHsva) => ({
        h: prevHsva.h, // Preserve internal hue for greys
        s: newHsvaFromProps.s,
        v: newHsvaFromProps.v,
        a: newHsvaFromProps.a,
      }));
    } else {
      setHsva(newHsvaFromProps);
    }
  }, [propsValue, hsva]);

  const updateHsvaComponent = useStableCallback(
    (newComponent: Partial<HsvaColor>) => {
      const newInternalHsva = { ...hsva, ...newComponent };
      setHsva(newInternalHsva);
      onChange(ColorProcessor.fromHsva(newInternalHsva).toRgba());
    }
  );

  const onRgbaInputChange = useStableCallback((newRgba: RgbaColor) => {
    const newHsvaFromInput = ColorProcessor.fromRgba(newRgba).toHsva();
    setHsva(newHsvaFromInput);
    onChange(newRgba);
  });

  // Callback for color grids that directly set RGBA
  const onGridColorSelected = useStableCallback((newRgba: RgbaColor) => {
    const newHsvaFromGrid = ColorProcessor.fromRgba(newRgba).toHsva();
    // For grid selections, directly update internal HSVA and notify parent
    // This behaves like onRgbaInputChange, ensuring H=0 for greys.
    setHsva(newHsvaFromGrid);
    onChange(newRgba);
  });

  const derivedRgba = ColorProcessor.fromHsva(hsva).toRgba();

  return (
    <Popover onOpenChange={(open) => !open && addRecentColor(derivedRgba)}>
      <PopoverTrigger asChild title={title}>
        <ColorButton
          className={cn("w-10 h-6", className)}
          color={derivedRgba}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col gap-big w-[350px]">
        <div className="flex flex-col gap-big">
          <div className="flex flex-row h-[136px] relative gap-big">
            <HsvWheel
              className="size-[136px]"
              color={hsva}
              setColor={updateHsvaComponent}
            />
            <HsValueSlider
              className="h-full"
              color={hsva}
              value={hsva.v}
              onChange={(v) => updateHsvaComponent({ v })}
            />
            <AlphaSlider
              className="h-full"
              color={hsva}
              value={hsva.a * 100}
              onChange={(a) => updateHsvaComponent({ a: a / 100 })}
            />
            <ColorInputs
              className="w-[120px]"
              color={derivedRgba}
              onChange={onRgbaInputChange}
            />
          </div>
          <div className="flex flex-row gap-big h-[70px] w-full">
            <div className="relative flex-1">
              <ColorButton className="absolute size-full" color={derivedRgba} />
              <div
                style={{
                  color: ColorProcessor.fromRgba(
                    calculateForegroundColor(derivedRgba)
                  ).toRgbString(),
                }}
                className="absolute size-full flex items-end justify-end p-small"
              >
                <IconButton
                  type="star"
                  size={"small"}
                  onClick={() => addFavoriteColor(derivedRgba)}
                />
              </div>
            </div>
            <FavoriteColorGrid
              className="flex-1"
              onSelected={onGridColorSelected}
            />
            <RecentColorGrid
              className="flex-1"
              onSelected={onGridColorSelected}
            />
            <ThemesColorGrid
              className="flex-1"
              onSelected={onGridColorSelected}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

