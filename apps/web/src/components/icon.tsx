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
  Lock,
  Unlock,
  Eye,
  EyeOff,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Copy,
  RotateCcw,
  Github,
  Bug,
  Square,
  MousePointerSquare,
  MousePointerSquareDashed,
  Fullscreen,
  Undo,
  Redo,
  FilePlus,
  BoxSelect,
} from "lucide-react";
import { Deselect } from "./icons/deselect";

export type IconType =
  | "pen"
  | "pencil"
  | "moon"
  | "sun"
  | "plus"
  | "brush"
  | "command"
  | "save"
  | "add-file"
  | "lock"
  | "unlock"
  | "visible"
  | "hidden"
  | "x"
  | "arrow-up"
  | "arrow-down"
  | "arrow-up-to-line"
  | "arrow-down-to-line"
  | "copy"
  | "reset"
  | "github"
  | "bug"
  | "square"
  | "mouse-pointer-square"
  | "mouse-pointer-square-dashed"
  | "fullscreen"
  | "undo"
  | "redo"
  | "file-plus"
  | "rectangle-select"
  | "deselect";

export type IconSize = "small" | "small-medium" | "medium" | number;

const renderLucideIcon = (
  icon: IconType,
  size: IconSize,
  className?: string
) => {
  const fontSize =
    typeof size === "number"
      ? size
      : size === "medium"
      ? 24
      : size === "small-medium"
      ? 20
      : 16;

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
    case "lock":
      return <Lock className={className} size={fontSize} />;
    case "unlock":
      return <Unlock className={className} size={fontSize} />;
    case "visible":
      return <Eye className={className} size={fontSize} />;
    case "hidden":
      return <EyeOff className={className} size={fontSize} />;
    case "x":
      return <X className={className} size={fontSize} />;
    case "arrow-up":
      return <ArrowUp className={className} size={fontSize} />;
    case "arrow-down":
      return <ArrowDown className={className} size={fontSize} />;
    case "arrow-up-to-line":
      return <ArrowUpToLine className={className} size={fontSize} />;
    case "arrow-down-to-line":
      return <ArrowDownToLine className={className} size={fontSize} />;
    case "copy":
      return <Copy className={className} size={fontSize} />;
    case "reset":
      return <RotateCcw className={className} size={fontSize} />;
    case "github":
      return <Github className={className} size={fontSize} />;
    case "bug":
      return <Bug className={className} size={fontSize} />;
    case "square":
      return <Square className={className} size={fontSize} />;
    case "mouse-pointer-square":
      return <MousePointerSquare className={className} size={fontSize} />;
    case "mouse-pointer-square-dashed":
      return <MousePointerSquareDashed className={className} size={fontSize} />;
    case "fullscreen":
      return <Fullscreen className={className} size={fontSize} />;
    case "undo":
      return <Undo className={className} size={fontSize} />;
    case "redo":
      return <Redo className={className} size={fontSize} />;
    case "file-plus":
      return <FilePlus className={className} size={fontSize} />;
    case "rectangle-select":
      return <BoxSelect className={className} size={fontSize} />;
    case "deselect":
      return <Deselect className={className} size={fontSize} />;
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
