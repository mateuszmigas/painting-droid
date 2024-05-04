import type {
  CanvasTool,
  CanvasToolEvent,
  CanvasToolMetadata,
} from "./canvasTool";
import type { CanvasBitmapContext } from "@/utils/common";
import { getTranslations } from "@/translations";
import { type RgbaColor, areColorsClose } from "@/utils/color";
import { floodFill } from "@/utils/imageOperations";

const translations = getTranslations().tools.draw.fill;

export const fillDrawToolMetadata: CanvasToolMetadata = {
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

export class FillDrawTool implements CanvasTool {
  private fillColor: RgbaColor | null = null;
  private onCommitCallback: (() => void) | null = null;

  constructor(private bitmapContext: CanvasBitmapContext) {}

  configure(settings: FillDrawToolSettings): void {
    const { color } = settings;
    this.fillColor = color;
  }

  processEvent(event: CanvasToolEvent) {
    if (event.type !== "manipulationStart") {
      return;
    }
    const imageData = this.bitmapContext.getImageData(
      0,
      0,
      this.bitmapContext.canvas.width,
      this.bitmapContext.canvas.height
    );

    const filledData = floodFill(
      imageData,
      { x: ~~event.position.x, y: ~~event.position.y },
      this.fillColor!,
      (targetColor, originColor) => areColorsClose(targetColor, originColor, 10)
    );

    imageData.data.set(filledData.data);
    this.bitmapContext.putImageData(imageData, 0, 0);
    this.onCommitCallback?.();
  }

  onCommit(callback: () => void) {
    this.onCommitCallback = callback;
  }

  reset() {}
}

