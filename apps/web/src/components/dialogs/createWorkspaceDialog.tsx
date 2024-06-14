import { Button } from "../ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { memo } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useState } from "react";
import type { Color, Size } from "@/utils/common";
import { scaleRectangleToFitParent } from "@/utils/geometry";
import { ColorPicker } from "../color/colorPicker";
import { defaultCanvasColor } from "@/constants";
import { Input } from "../ui/input";
import { getTranslations } from "@/translations";

const translations = getTranslations();
const dialogTranslations = translations.dialogs.createWorkspace;

const parentSize = { width: 96, height: 64 };
const calculateSvgRect = (width: number, height: number) => {
  const { x, y, scale } = scaleRectangleToFitParent(
    { x: 0, y: 0, width, height },
    parentSize,
    1
  );
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
  (props: {
    close: (result: { size: Size; name: string; color: Color }) => void;
  }) => {
    const { close } = props;
    const [sizeKey, setSizeKey] = useState(sizes[0].key);
    const [color, setColor] = useState<Color>(defaultCanvasColor);
    const [name, setName] = useState("");

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTranslations.title}</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-big"
          onSubmit={(e) => {
            e.preventDefault();
            const size = sizes.find((s) => s.key === sizeKey)!;
            close({ size, name, color });
          }}
        >
          <div className="flex flex-row gap-big">
            <div className="flex flex-col gap-form-field flex-1">
              <Label>{dialogTranslations.fields.name}</Label>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-form-field">
              <Label>{dialogTranslations.fields.color.name}</Label>
              <ColorPicker
                value={color}
                onChange={setColor}
                title={dialogTranslations.fields.color.title}
                className={"h-input-thick w-16"}
              />
            </div>
          </div>
          <RadioGroup
            value={sizeKey}
            onValueChange={setSizeKey}
            className="grid grid-cols-3 gap-big"
          >
            {sizes.map((size) => (
              <div key={size.key}>
                <RadioGroupItem
                  value={size.key}
                  id={size.key}
                  className="peer sr-only"
                />
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
  }
);

