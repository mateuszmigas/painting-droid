import type { DrawTool, DrawToolEvent, DrawToolMetadata } from "./drawTool";
import type { CanvasRasterContext } from "@/utils/common";
import { getTranslations } from "@/translations";
import { RgbaColor, areColorsClose } from "@/utils/color";
import { floodFill } from "@/utils/imageOperations";

const translations = getTranslations().tools.draw.fill;

export const fillDrawToolMetadata: DrawToolMetadata = {
  id: "fill",
  name: translations.name,
  icon: "paint-bucket",
  settings: {
    color: {
      name: translations.settings.color,
      type: "color",
      default: { b: 200, g: 243, r: 75, a: 1 },
    },
  },
} as const;

type FillDrawToolSettings = {
  color: RgbaColor;
};

export class FillDrawTool implements DrawTool {
  private fillColor: RgbaColor | null = null;

  constructor(private context: CanvasRasterContext) {}

  configure(settings: FillDrawToolSettings): void {
    const { color } = settings;
    this.fillColor = color;
  }

  processEvent(event: DrawToolEvent) {
    if (event.type !== "manipulationStart") {
      return;
    }
    const imageData = this.context.getImageData(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    const filledData = floodFill(
      imageData,
      { x: ~~event.position.x, y: ~~event.position.y },
      this.fillColor!,
      (targetColor, originColor) => areColorsClose(targetColor, originColor, 10)
    );

    imageData.data.set(filledData.data);
    this.context.putImageData(imageData, 0, 0);
  }

  reset() {}
}

