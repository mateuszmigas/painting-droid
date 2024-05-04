import {
  type DrawToolId,
  drawToolsMetadata,
  getDefaultDrawToolSettings,
} from "./draw-tools";

export type ToolId = DrawToolId;

const defaultDrawToolsSettings = Object.keys(drawToolsMetadata).reduce(
  (result, toolId) => {
    result[toolId as ToolId] = getDefaultDrawToolSettings(toolId as DrawToolId);
    return result;
  },
  {} as Record<ToolId, Record<string, unknown>>
);

export const defaultToolsSettings = {
  ...defaultDrawToolsSettings,
};

export const toolsMetadata = {
  ...drawToolsMetadata,
} as const;

