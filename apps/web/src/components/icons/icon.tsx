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
  SquareMousePointer,
  MousePointerSquareDashed,
  Fullscreen,
  Undo,
  Redo,
  FilePlus,
  BoxSelect,
  Loader,
  Check,
  Brain,
  Menu,
  Image,
  Shapes,
  FolderOpen,
  ClipboardCopy,
  ClipboardPaste,
  ClipboardX,
  Eraser,
  Download,
  Crop,
  MoveLeft,
  MoveRight,
  MoveUp,
  MoveDown,
  MoveUpLeft,
  MoveUpRight,
  MoveDownLeft,
  MoveDownRight,
  ArrowDownFromLine,
  Scaling,
  Settings,
  Trash2,
  PlusCircle,
  ExternalLink,
  Merge,
  Star,
  PaintBucket,
  SprayCan,
  Tags,
  Scissors,
  Share,
  HelpCircle,
  ImagePlus,
  Images,
  FileCog,
  Settings2,
  ImageMinus,
  Bot,
  BotMessageSquare,
  WandSparkles,
  RefreshCw,
} from "lucide-react";
import { Deselect } from "./custom/deselect";
import { AnchorTopLeft } from "./custom/anchorTopLeft";
import { AiLabel } from "../aiLabel";
import { cn } from "@/utils/css";

type BaseIconType =
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
  | "deselect"
  | "loader"
  | "check"
  | "brain"
  | "menu"
  | "image"
  | "shapes"
  | "folder-open"
  | "clipboard-copy"
  | "clipboard-paste"
  | "clipboard-cut"
  | "eraser"
  | "download"
  | "crop"
  | "scissors"
  | "move-left"
  | "move-right"
  | "move-up"
  | "move-down"
  | "move-up-left"
  | "move-up-right"
  | "move-down-left"
  | "move-down-right"
  | "anchor-top"
  | "anchor-bottom"
  | "anchor-left"
  | "anchor-right"
  | "anchor-top-left"
  | "anchor-top-right"
  | "anchor-bottom-left"
  | "anchor-bottom-right"
  | "resize"
  | "settings"
  | "trash"
  | "plus-circle"
  | "external-link"
  | "merge"
  | "star"
  | "paint-bucket"
  | "spray-can"
  | "tags"
  | "share"
  | "help"
  | "image-add"
  | "image-copy"
  | "file-cog"
  | "settings2"
  | "image-minus"
  | "bot"
  | "bot-message-square"
  | "wand-sparkles"
  | "refresh";

export type IconType = BaseIconType | `${BaseIconType}_ai`;

export type IconSize = "small" | "small-medium" | "medium" | number;

const renderLucideIcon = (
  icon: BaseIconType,
  fontSize: number,
  className?: string
) => {
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
      return <SquareMousePointer className={className} size={fontSize} />;
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
    case "loader":
      return <Loader className={className} size={fontSize} />;
    case "check":
      return <Check className={className} size={fontSize} />;
    case "brain":
      return <Brain className={className} size={fontSize} />;
    case "menu":
      return <Menu className={className} size={fontSize} />;
    case "image":
      return <Image className={className} size={fontSize} />;
    case "shapes":
      return <Shapes className={className} size={fontSize} />;
    case "folder-open":
      return <FolderOpen className={className} size={fontSize} />;
    case "clipboard-copy":
      return <ClipboardCopy className={className} size={fontSize} />;
    case "clipboard-paste":
      return <ClipboardPaste className={className} size={fontSize} />;
    case "clipboard-cut":
      return <ClipboardX className={className} size={fontSize} />;
    case "eraser":
      return <Eraser className={className} size={fontSize} />;
    case "download":
      return <Download className={className} size={fontSize} />;
    case "crop":
      return <Crop className={className} size={fontSize} />;
    case "scissors":
      return <Scissors className={className} size={fontSize} />;
    case "move-left":
      return <MoveLeft className={className} size={fontSize} />;
    case "move-right":
      return <MoveRight className={className} size={fontSize} />;
    case "move-up":
      return <MoveUp className={className} size={fontSize} />;
    case "move-down":
      return <MoveDown className={className} size={fontSize} />;
    case "move-up-left":
      return <MoveUpLeft className={className} size={fontSize} />;
    case "move-up-right":
      return <MoveUpRight className={className} size={fontSize} />;
    case "move-down-left":
      return <MoveDownLeft className={className} size={fontSize} />;
    case "move-down-right":
      return <MoveDownRight className={className} size={fontSize} />;
    case "anchor-top":
      return <ArrowDownFromLine className={className} size={fontSize} />;
    case "anchor-bottom":
      return (
        <ArrowDownFromLine
          className={`rotate-180 ${className}`}
          size={fontSize}
        />
      );
    case "anchor-left":
      return (
        <ArrowDownFromLine
          className={`-rotate-90 ${className}`}
          size={fontSize}
        />
      );
    case "anchor-right":
      return (
        <ArrowDownFromLine
          className={`rotate-90 ${className}`}
          size={fontSize}
        />
      );
    case "anchor-top-left":
      return <AnchorTopLeft className={className} size={fontSize} />;
    case "anchor-top-right":
      return (
        <AnchorTopLeft className={`rotate-90 ${className}`} size={fontSize} />
      );
    case "anchor-bottom-left":
      return (
        <AnchorTopLeft className={`-rotate-90 ${className}`} size={fontSize} />
      );
    case "anchor-bottom-right":
      return (
        <AnchorTopLeft className={`rotate-180 ${className}`} size={fontSize} />
      );
    case "resize":
      return <Scaling className={className} size={fontSize} />;
    case "settings":
      return <Settings className={className} size={fontSize} />;
    case "trash":
      return <Trash2 className={className} size={fontSize} />;
    case "plus-circle":
      return <PlusCircle className={className} size={fontSize} />;
    case "external-link":
      return <ExternalLink className={className} size={fontSize} />;
    case "merge":
      return <Merge className={`rotate-180 ${className}`} size={fontSize} />;
    case "star":
      return <Star className={className} size={fontSize} />;
    case "paint-bucket":
      return <PaintBucket className={className} size={fontSize} />;
    case "spray-can":
      return <SprayCan className={className} size={fontSize} />;
    case "tags":
      return <Tags className={className} size={fontSize} />;
    case "share":
      return <Share className={className} size={fontSize} />;
    case "help":
      return <HelpCircle className={className} size={fontSize} />;
    case "image-add":
      return <ImagePlus className={className} size={fontSize} />;
    case "image-copy":
      return <Images className={className} size={fontSize} />;
    case "file-cog":
      return <FileCog className={className} size={fontSize} />;
    case "settings2":
      return <Settings2 className={className} size={fontSize} />;
    case "image-minus":
      return <ImageMinus className={className} size={fontSize} />;
    case "bot":
      return <Bot className={className} size={fontSize} />;
    case "bot-message-square":
      return <BotMessageSquare className={className} size={fontSize} />;
    case "wand-sparkles":
      return <WandSparkles className={className} size={fontSize} />;
    case "refresh":
      return <RefreshCw className={className} size={fontSize} />;
    default:
      return assertNever(icon);
  }
};

const calculateFontSize = (size: IconSize) => {
  const fontSize =
    typeof size === "number"
      ? size
      : size === "medium"
      ? 24
      : size === "small-medium"
      ? 20
      : 16;
  return fontSize;
};

export const Icon = (props: {
  type: IconType;
  size: IconSize;
  className?: string;
}) => {
  const { type, size, className } = props;
  const fontSize = calculateFontSize(size);

  if (type.endsWith("_ai")) {
    const baseType = type.slice(0, -3) as BaseIconType;
    return (
      <div
        style={{ width: fontSize, height: fontSize }}
        className={cn("relative", className)}
      >
        {renderLucideIcon(baseType, fontSize, className)}
        <AiLabel
          size={fontSize / 2}
          className="absolute -right-0.5 -bottom-0.5"
        />
      </div>
    );
  }
  return renderLucideIcon(type as BaseIconType, fontSize, className);
};

