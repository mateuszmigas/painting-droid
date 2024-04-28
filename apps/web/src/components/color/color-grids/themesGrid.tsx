import { useMemo, useState } from "react";
import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorGrid } from "./colorGrid";
import type { RgbaColor } from "@/utils/color";
import { cn } from "@/utils/css";

const themes: { id: string; name: string; colors: RgbaColor[] }[] = [
  {
    id: "basic",
    name: "Basic",
    colors: [
      { r: 255, g: 255, b: 255, a: 1 },
      { r: 255, g: 0, b: 0, a: 1 },
      { r: 0, g: 128, b: 0, a: 1 },
      { r: 0, g: 0, b: 255, a: 1 },
      { r: 255, g: 255, b: 0, a: 1 },
      { r: 0, g: 0, b: 0, a: 1 },
    ],
  },
  {
    id: "vintage",
    name: "Vintage",
    colors: [
      { r: 255, g: 255, b: 255, a: 1 },
      { r: 38, g: 70, b: 83, a: 1 },
      { r: 42, g: 157, b: 143, a: 1 },
      { r: 233, g: 196, b: 106, a: 1 },
      { r: 244, g: 162, b: 97, a: 1 },
      { r: 231, g: 111, b: 81, a: 1 },
    ],
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: [
      { r: 255, g: 255, b: 255, a: 1 },
      { r: 230, g: 57, b: 70, a: 1 },
      { r: 241, g: 250, b: 238, a: 1 },
      { r: 168, g: 218, b: 220, a: 1 },
      { r: 69, g: 123, b: 157, a: 1 },
      { r: 29, g: 53, b: 87, a: 1 },
    ],
  },
  {
    id: "rainbow",
    name: "Rainbow",
    colors: [
      { r: 255, g: 255, b: 255, a: 1 },
      { r: 255, g: 190, b: 11, a: 1 },
      { r: 251, g: 86, b: 7, a: 1 },
      { r: 255, g: 0, b: 110, a: 1 },
      { r: 131, g: 56, b: 236, a: 1 },
      { r: 58, g: 134, b: 255, a: 1 },
    ],
  },
];

export const ThemesColorGrid = memo(
  (props: { onSelected: (color: RgbaColor) => void; className?: string }) => {
    const { onSelected, className } = props;
    const [value, onChange] = useState("basic");
    const options = useMemo(
      () => themes.map((theme) => ({ value: theme.id, label: theme.name })),
      []
    );
    return (
      <div className={cn("flex flex-col justify-between", className)}>
        <Select
          value={value as string}
          onValueChange={(value) => onChange(value)}
        >
          <SelectTrigger
            className={"text-xs h-[20px] pl-small pr-0 max-w-[70px] truncate"}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value as string}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ColorGrid
          onSelected={onSelected}
          colors={themes.find((theme) => theme.id === value)?.colors || []}
        />
      </div>
    );
  }
);

