import { brushDrawToolMetadata } from "./brushDrawTool";
import { pencilDrawToolMetadata } from "./pencilDrawTool";
import { eraserDrawToolMetadata } from "./eraserDrawTool";
import { fillDrawToolMetadata } from "./fillDrawTool";
import { rectangleSelectToolMetadata } from "./rectangleSelectionDrawTool";

export const canvasToolsMetadata = {
  brush: brushDrawToolMetadata,
  pencil: pencilDrawToolMetadata,
  eraser: eraserDrawToolMetadata,
  fill: fillDrawToolMetadata,
  rectangleSelect: rectangleSelectToolMetadata,
} as const;

export type CanvasToolId = keyof typeof canvasToolsMetadata;

export const getDefaultCanvasToolSettings = (toolId: CanvasToolId) => {
  const result: Record<string, unknown> = {};
  Object.entries(canvasToolsMetadata[toolId].settings).forEach(
    ([key, value]) => {
      result[key] = value.default;
    }
  );
  return result;
};

