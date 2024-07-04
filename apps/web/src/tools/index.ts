import { brushDrawToolMetadata } from "./brushDrawTool";
import { pencilDrawToolMetadata } from "./pencilDrawTool";
import { eraserDrawToolMetadata } from "./eraserDrawTool";
import { fillDrawToolMetadata } from "./fillDrawTool";
import { rectangleSelectToolMetadata } from "./rectangleSelectTool";
import { sprayDrawToolMetadata } from "./sprayDrawTool";
import { shapeDrawToolMetadata } from "./shapeDrawTool";
import { magicWandSelectToolMetadata } from "./magicWandSelectTool";

export const canvasToolsMetadata = {
  brush: brushDrawToolMetadata,
  pencil: pencilDrawToolMetadata,
  eraser: eraserDrawToolMetadata,
  fill: fillDrawToolMetadata,
  spray: sprayDrawToolMetadata,
  rectangleSelect: rectangleSelectToolMetadata,
  magicWand: magicWandSelectToolMetadata,
  shape: shapeDrawToolMetadata,
} as const;

const getDefaultCanvasToolSettings = (toolId: CanvasToolId) => {
  const result: Record<string, unknown> = {};
  Object.entries(canvasToolsMetadata[toolId].settingsSchema).forEach(
    ([key, value]) => {
      result[key] = (value as { defaultValue: unknown }).defaultValue;
    }
  );
  return result;
};

export type CanvasToolId = keyof typeof canvasToolsMetadata;

export const defaultCanvasToolsSettings = Object.keys(
  canvasToolsMetadata
).reduce((result, toolId) => {
  result[toolId as CanvasToolId] = getDefaultCanvasToolSettings(
    toolId as CanvasToolId
  );
  return result;
}, {} as Record<CanvasToolId, Record<string, unknown>>);

