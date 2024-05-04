import {
  type CanvasToolId,
  canvasToolsMetadata,
  getDefaultCanvasToolSettings,
} from "./draw-tools";

export type ToolId = CanvasToolId;

const defaultDrawToolsSettings = Object.keys(canvasToolsMetadata).reduce(
  (result, toolId) => {
    result[toolId as ToolId] = getDefaultCanvasToolSettings(
      toolId as CanvasToolId
    );
    return result;
  },
  {} as Record<ToolId, Record<string, unknown>>
);

export const defaultToolsSettings = {
  ...defaultDrawToolsSettings,
};

export const toolsMetadata = {
  ...canvasToolsMetadata,
} as const;

