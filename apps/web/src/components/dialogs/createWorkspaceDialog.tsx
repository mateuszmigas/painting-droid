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
import { type Size, scaleRectangleToFitParent } from "@/utils/common";

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
    width: 800,
    height: 600,
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
  (props: { close: (result: Size) => void }) => {
    const { close } = props;
    const [selectedSize, setSelectedSize] = useState(sizes[0].key);
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-big"
          onSubmit={(e) => {
            e.preventDefault();
            close(sizes.find((size) => size.key === selectedSize)!);
          }}
        >
          <div>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
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
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    );
  }
);

