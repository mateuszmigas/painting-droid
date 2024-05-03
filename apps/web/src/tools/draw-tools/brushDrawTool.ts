import type { DrawTool, DrawToolEvent, DrawToolMetadata } from "./drawTool";
import type { CanvasRasterContext, Color, Position } from "@/utils/common";
import { getTranslations } from "@/translations";
import { ColorProcessor } from "@/utils/colorProcessor";

const translations = getTranslations().tools.draw.brush;

export const brushDrawToolMetadata: DrawToolMetadata = {
  id: "brush",
  name: translations.name,
  icon: "brush",
  settings: {
    color: {
      name: translations.settings.color,
      type: "color",
      default: { r: 23, b: 139, g: 84, a: 1 },
    },
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

type BrushDrawToolSettings = {
  color: Color;
  size: number;
};

export class BrushDrawTool implements DrawTool {
  private previousPosition: Position | null = null;

  constructor(private rasterContext: CanvasRasterContext) {}

  configure(settings: BrushDrawToolSettings): void {
    const { size, color } = settings;
    this.rasterContext.lineWidth = size;
    this.rasterContext.strokeStyle =
      ColorProcessor.fromRgba(color).toRgbaString();
    this.rasterContext.lineCap = "round";
  }

  processEvent(event: DrawToolEvent): void {
    if (this.previousPosition) {
      this.rasterContext.beginPath();
      this.rasterContext.moveTo(
        this.previousPosition.x,
        this.previousPosition.y
      );
      this.rasterContext.lineTo(event.position.x, event.position.y);
      this.rasterContext.stroke();
    }

    this.previousPosition = event.position;
  }

  reset() {
    this.previousPosition = null;
  }
}

