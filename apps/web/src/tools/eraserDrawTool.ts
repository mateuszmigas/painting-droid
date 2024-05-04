import type {
  CanvasTool,
  CanvasToolEvent,
  CanvasToolMetadata,
} from "./canvasTool";
import type { CanvasBitmapContext, Position } from "@/utils/common";
import { getTranslations } from "@/translations";

const translations = getTranslations().tools.draw.eraser;

export const eraserDrawToolMetadata: CanvasToolMetadata = {
  id: "eraser",
  name: translations.name,
  icon: "eraser",
  settings: {
    size: {
      name: translations.settings.size,
      type: "size",
      default: 3,
      options: [
        { value: 1, label: "1px" },
        { value: 3, label: "3px" },
        { value: 5, label: "5px" },
        { value: 10, label: "10px" },
        { value: 20, label: "20px" },
        { value: 50, label: "50px" },
      ],
    },
  },
} as const;

type EraserDrawToolSettings = {
  size: number;
};

export class EraserDrawTool implements CanvasTool {
  private previousPosition: Position | null = null;
  private onCommitCallback: (() => void) | null = null;

  constructor(private context: CanvasBitmapContext) {}

  configure(settings: EraserDrawToolSettings): void {
    const { size } = settings;
    this.context.lineWidth = size;
    this.context.strokeStyle = "white";
    this.context.lineCap = "round";
  }

  processEvent(event: CanvasToolEvent) {
    if (!this.previousPosition) {
      this.previousPosition = event.position;
    }

    this.context.save();
    this.context.globalCompositeOperation = "destination-out";
    this.context.beginPath();
    this.context.moveTo(this.previousPosition.x, this.previousPosition.y);
    this.context.lineTo(event.position.x, event.position.y);
    this.context.stroke();
    this.context.restore();

    this.previousPosition = event.position;

    if (event.type === "manipulationEnd") {
      this.previousPosition = null;
      this.onCommitCallback?.();
    }
  }

  onCommit(callback: () => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    this.previousPosition = null;
  }
}

