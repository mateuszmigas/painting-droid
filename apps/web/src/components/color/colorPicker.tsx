import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ColorWheel } from "./colorWheel";
import { LightnessSlider } from "./lightnessSlider";
import { OpacitySlider } from "./opacitySlider";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { OptionSetting } from "../tool-settings/optionSetting";
import { Label } from "../ui/label";

const predefined = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff"];

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export const ColorPicker = (props: {}) => {
  const [lightness, setLightness] = useState(33);
  const [opacity, setOpacity] = useState(100);
  return (
    <Popover open>
      <PopoverTrigger>
        <div>Dupa</div>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col gap-big w-fit">
        <div className="flex flex-row gap-big">
          <div className="flex flex-row h-32 relative gap-big">
            <ColorWheel />
            <LightnessSlider
              className="h-full"
              value={lightness}
              onChange={setLightness}
            />
            <OpacitySlider
              className="h-full _bg-blue-200"
              value={opacity}
              onChange={setOpacity}
            />
          </div>
          <div className="_w-[100px] flex flex-col gap-small">
            <div className="flex flex-row items-center gap-big">
              <Label className="text-xs w-10">HEX</Label>
              <Input
                className="text-xs h-input-thin w-16 text-right px-small"
                defaultValue={"#ff00ff"}
              />
            </div>
            <div className="flex flex-row items-center gap-big">
              <Label className="text-xs w-10">Red</Label>
              <Input
                className="text-xs h-input-thin w-16 text-right"
                defaultValue={132}
              />
            </div>
            <div className="flex flex-row items-center gap-big">
              <Label className="text-xs w-10">Green</Label>
              <Input
                className="text-xs h-input-thin w-16 text-right"
                defaultValue={132}
              />
            </div>
            <div className="flex flex-row items-center gap-big">
              <Label className="text-xs w-10">Blue</Label>
              <Input
                className="text-xs h-input-thin w-16 text-right"
                defaultValue={132}
              />
            </div>
            <div className="flex flex-row items-center gap-big">
              <Label className="text-xs w-10">Opacity</Label>
              <Input
                className="text-xs h-input-thin w-16 text-right"
                defaultValue={132}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-medium">
          {predefined.map((color, index) => (
            <div
              key={color}
              className={`w-8 h-8 rounded-md border ${
                index === 0 ? "border-primary" : ""
              }`}
              style={{ backgroundColor: color }}
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
