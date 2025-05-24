import {
  type InferToolSettings,
  createCanvasToolMetadata,
  createCanvasToolSettingsSchema,
  type CanvasTool,
  type CanvasToolEvent,
  type CanvasToolResult,
} from "./canvasTool";
import type { CanvasBitmapContext } from "@/utils/common";
import { getTranslations } from "@/translations";
import { type RgbaColor, areColorsClose } from "@/utils/color";
import { floodFill as cpuFloodFill } from "@/utils/imageOperations";
import { webgpuFloodFill, isWebGPUSupported } from "../../utils/webgpuFloodFill";

const translations = getTranslations().tools.fillDraw;

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
  private onCommitCallback: ((result: CanvasToolResult) => void) | null = null;

  constructor(private bitmapContext: CanvasBitmapContext) {}

  configure(settings: FillDrawToolSettings) {
    const { color, tolerance } = settings;
    this.fillColor = color;
    this.tolerance = tolerance;
  }

  async processEvent(event: CanvasToolEvent) {
    if (event.type !== "pointerDown" || !this.fillColor) {
      return;
    }

    const { canvas } = this.bitmapContext;
    const { width, height } = canvas;
    const startX = ~~event.canvasPosition.x;
    const startY = ~~event.canvasPosition.y;

    const originalImageData = this.bitmapContext.getImageData(0, 0, width, height);
    let filledImageData: ImageData | null = null;

    if (isWebGPUSupported()) {
      console.log("Attempting WebGPU Flood Fill");
      try {
        // webgpuFloodFill expects fillColor as [R, G, B, A] where each is 0-255
        const fillColorArray: [number, number, number, number] = [
          this.fillColor.r,
          this.fillColor.g,
          this.fillColor.b,
          // WebGPU expects alpha as 0-255, whereas RgbaColor has a as 0-1.
          // Assuming the shader and webgpuFloodFill function expect 0-255 for alpha.
          // Let's ensure this.fillColor.a is scaled correctly if it's 0-1.
          // The current RgbaColor type has 'a' as 0-1. The shader uses u32 for colors,
          // where alpha is the highest 8 bits. So, it should be 0-255.
          // Let's assume fillColor.a is already 0-255 for now, or adjust if needed.
          // The provided RgbaColor type from @/utils/color has 'a' as 0..1
          // The webgpuFloodFill function in the previous step was updated to take targetColor directly from start pixel.
          // It uses fillColor parameter for the new color.
          // Let's ensure the fillColor passed to webgpuFloodFill has alpha correctly scaled.
          Math.round(this.fillColor.a * 255),
        ];

        filledImageData = await webgpuFloodFill(
          originalImageData,
          startX,
          startY,
          fillColorArray,
          this.tolerance
        );
        if (filledImageData) {
          console.log("WebGPU Flood Fill successful.");
        } else {
          console.log("WebGPU Flood Fill returned null, falling back to CPU.");
        }
      } catch (error) {
        console.error("WebGPU Flood Fill failed, falling back to CPU:", error);
        filledImageData = null; // Ensure fallback
      }
    }

    if (!filledImageData) {
      console.log("Using CPU Flood Fill.");
      // Ensure a fresh copy of originalImageData is used if WebGPU attempt modified it partially (though it shouldn't)
      const cpuImageData = this.bitmapContext.getImageData(0, 0, width, height);
      const filledCpuData = cpuFloodFill(
        cpuImageData,
        { x: startX, y: startY },
        this.fillColor, // cpuFloodFill expects RgbaColor object
        (targetColor, originColor) =>
          areColorsClose(targetColor, originColor, this.tolerance)
      );
      // cpuFloodFill returns a new ImageData object with the filled data.
      filledImageData = filledCpuData;
    }

    if (filledImageData) {
      this.bitmapContext.putImageData(filledImageData, 0, 0);
      this.onCommitCallback?.({ bitmapContextChanged: true });
    }
  }

  onCommit(callback: (result: CanvasToolResult) => void) {
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

