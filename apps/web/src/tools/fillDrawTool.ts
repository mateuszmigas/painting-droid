import {
  type InferToolSettings,
  createCanvasToolMetadata,
  createCanvasToolSettingsSchema,
  type CanvasTool,
  type CanvasToolEvent,
} from "./canvasTool";
import type { CanvasBitmapContext } from "@/utils/common";
import { getTranslations } from "@/translations";
import { type RgbaColor, areColorsClose } from "@/utils/color";
import { floodFill } from "@/utils/imageOperations";

const translations = getTranslations().tools.draw.fill;

const settingsSchema = createCanvasToolSettingsSchema({
  color: {
    name: translations.settings.color,
    type: "color",
    defaultValue: { b: 200, g: 243, r: 75, a: 1 },
  },
  tolerance: {
    name: translations.settings.tolerance,
    type: "range-percent",
    defaultValue: 10,
    min: 0,
    max: 50,
  },
});

type FillDrawToolSettings = InferToolSettings<typeof settingsSchema>;

export class FillDrawTool implements CanvasTool<FillDrawToolSettings> {
  private fillColor: RgbaColor | null = null;
  private tolerance = 0;
  private onCommitCallback: (() => void) | null = null;

  constructor(private bitmapContext: CanvasBitmapContext) {}

  configure(settings: FillDrawToolSettings): void {
    const { color, tolerance } = settings;
    this.fillColor = color;
    this.tolerance = tolerance;
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
      (targetColor, originColor) =>
        areColorsClose(targetColor, originColor, this.tolerance)
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

export const fillDrawToolMetadata = createCanvasToolMetadata({
  id: "fill",
  name: translations.name,
  icon: "paint-bucket",
  settingsSchema,
  create: (context) => new FillDrawTool(context.bitmap),
});

