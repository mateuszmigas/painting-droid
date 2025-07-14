import { memo, useState } from "react";
import { defaultCanvasColor } from "@/constants";
import { getTranslations } from "@/translations";
import type { Color, Size } from "@/utils/common";
import { scaleRectangleToFitParent } from "@/utils/geometry";
import { ColorButton } from "../color/colorButton";
import { ColorPicker } from "../color/colorPicker";
import { Button } from "../ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const translations = getTranslations();
const dialogTranslations = translations.dialogs.createWorkspace;

const parentSize = { width: 96, height: 64 };
const calculateSvgRect = (width: number, height: number) => {
  const { x, y, scale } = scaleRectangleToFitParent({ x: 0, y: 0, width, height }, parentSize, 1);
  return {
    x: `${x}`,
    y: `${y}`,
    width: `${scale * width}`,
    height: `${scale * height}`,
  };
};

const sizes = [
  {
    key: "default",
    name: "Default",
    width: 1024,
    height: 1024,
  },
  {
    key: "full-hd",
    name: "Full HD",
    width: 1920,
    height: 1080,
  },
  {
    key: "instagram",
    name: "Instagram",
    width: 1080,
    height: 1080,
  },
  {
    key: "youtube",
    name: "Youtube",
    width: 1080,
    height: 720,
  },
  {
    key: "twitter-profile",
    name: "Twitter Profile",
    width: 400,
    height: 400,
  },
  {
    key: "twitter-header",
    name: "Twitter Header",
    width: 1500,
    height: 500,
  },
];

export const CreateWorkspaceDialog = memo(
  (props: { close: (result: { size: Size; name: string; color: Color | null }) => void }) => {
    const { close } = props;
    const [sizeKey, setSizeKey] = useState(sizes[0].key);
    const [name, setName] = useState("");
    const [color, setColor] = useState<Color>(defaultCanvasColor);
    const [backgroundType, setBackgroundType] = useState<"none" | "solid">("solid");

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTranslations.title}</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-big"
          onSubmit={(e) => {
            e.preventDefault();
            const selectedSize = sizes.find((s) => s.key === sizeKey)!;
            const selectedColor = backgroundType === "solid" ? color : null;
            close({ size: selectedSize, name, color: selectedColor });
          }}
        >
          <div className="flex flex-row gap-big">
            <div className="flex flex-col gap-form-field-big flex-1">
              <Label>{dialogTranslations.fields.name}</Label>
              <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-form-field-big">
              <Label>{dialogTranslations.fields.background.name}</Label>
              <div className="flex flex-row gap-medium">
                <RadioGroup
                  value={backgroundType}
                  onValueChange={(value) => setBackgroundType(value as never)}
                  className="h-input-thick flex gap-big"
                >
                  <div className="flex items-center gap-small">
                    <RadioGroupItem value="none" id="radio-none" />
                    <Label htmlFor="radio-none">{dialogTranslations.fields.background.options.none}</Label>
                  </div>
                  <div className="flex items-center gap-small">
                    <RadioGroupItem value="solid" id="radio-solid-color" />
                    <Label htmlFor="radio-solid-color">{dialogTranslations.fields.background.options.solid}</Label>
                  </div>
                </RadioGroup>
                {backgroundType === "solid" ? (
                  <ColorPicker
                    value={color}
                    onChange={setColor}
                    title={dialogTranslations.fields.background.title}
                    className="h-input-thick w-input-thick"
                  />
                ) : (
                  <ColorButton
                    disabled
                    className="h-input-thick w-input-thick disabled:opacity-100"
                    color={{ r: 0, g: 0, b: 0, a: 0 }}
                    variant="ghost"
                  />
                )}
              </div>
            </div>
          </div>
          <RadioGroup value={sizeKey} onValueChange={setSizeKey} className="grid grid-cols-3 gap-big">
            {sizes.map((size) => (
              <div key={size.key}>
                <RadioGroupItem value={size.key} id={size.key} className="peer sr-only" />
                <Label
                  htmlFor={size.key}
                  className="flex flex-col gap-small items-center justify-between rounded-md border-2 border-muted bg-popover p-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={`0 0 ${parentSize.width} ${parentSize.height}`}
                    fill="hsl(var(--secondary))"
                    stroke="currentColor"
                    className="h-16 w-24"
                  >
                    <rect {...calculateSvgRect(size.width, size.height)} />
                  </svg>
                  <div>{size.name}</div>
                  <div className="text-xs">
                    {size.width} x {size.height} px
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <DialogFooter>
            <Button type="submit">{translations.general.create}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    );
  },
);
