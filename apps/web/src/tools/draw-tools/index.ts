import { brushDrawToolMetadata } from "./brushDrawTool";
import { pencilDrawToolMetadata } from "./pencilDrawTool";
import { eraserDrawToolMetadata } from "./eraserDrawTool";

export const drawToolsMetadata = {
  brush: brushDrawToolMetadata,
  pencil: pencilDrawToolMetadata,
  eraser: eraserDrawToolMetadata,
} as const;

export type DrawToolId = keyof typeof drawToolsMetadata;

export const getDefaultDrawToolSettings = (toolId: DrawToolId) => {
  const result: Record<string, unknown> = {};
  Object.entries(drawToolsMetadata[toolId].settings).forEach(([key, value]) => {
    result[key] = value.default;
  });
  return result;
};
