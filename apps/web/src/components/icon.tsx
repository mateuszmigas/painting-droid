/* This is an icon aggregator where all icons from various libraries are imported. 
  - https://lucide.dev/icons/
*/
import { assertNever } from "@/utils/typeGuards";
import {
  Pen,
  Pencil,
  Moon,
  Sun,
  Plus,
  Brush,
  Command,
  Save,
  FilePlus2,
} from "lucide-react";

export type IconType =
  | "pen"
  | "pencil"
  | "moon"
  | "sun"
  | "plus"
  | "brush"
  | "command"
  | "save"
  | "add-file";
export type IconSize = "small" | "small-medium" | "medium";

const renderLucideIcon = (
  icon: IconType,
  size: IconSize,
  className?: string
) => {
  const fontSize = size === "medium" ? 24 : size === "small-medium" ? 20 : 16;
  switch (icon) {
    case "pen":
      return <Pen className={className} size={fontSize} />;
    case "pencil":
      return <Pencil className={className} size={fontSize} />;
    case "moon":
      return <Moon className={className} size={fontSize} />;
    case "sun":
      return <Sun className={className} size={fontSize} />;
    case "plus":
      return <Plus className={className} size={fontSize} />;
    case "brush":
      return <Brush className={className} size={fontSize} />;
    case "command":
      return <Command className={className} size={fontSize} />;
    case "save":
      return <Save className={className} size={fontSize} />;
    case "add-file":
      return <FilePlus2 className={className} size={fontSize} />;
    default:
      return assertNever(icon);
  }
};

export const Icon = (props: {
  type: IconType;
  size: IconSize;
  className?: string;
}) => {
  const { type, size, className } = props;
  return renderLucideIcon(type, size, className);
};

