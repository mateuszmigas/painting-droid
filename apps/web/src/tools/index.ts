import {
  type DrawToolId,
  drawToolsMetadata,
  getDefaultDrawToolSettings,
} from "./draw-tools";
import {
  type ShapeToolId,
  shapeToolsMetadata,
  getDefaultShapeToolSettings,
} from "./shape-tools";

export type ToolId = DrawToolId | ShapeToolId;

const defaultDrawToolsSettings = Object.keys(drawToolsMetadata).reduce(
  (result, toolId) => {
    result[toolId as ToolId] = getDefaultDrawToolSettings(toolId as DrawToolId);
    return result;
  },
  {} as Record<ToolId, Record<string, unknown>>
);

const defaultShapeToolsSettings = Object.keys(shapeToolsMetadata).reduce(
  (result, toolId) => {
    result[toolId as ToolId] = getDefaultShapeToolSettings(
      toolId as ShapeToolId
    );
    return result;
  },
  {} as Record<ToolId, Record<string, unknown>>
);

export const defaultToolsSettings = {
  ...defaultDrawToolsSettings,
  ...defaultShapeToolsSettings,
};

export const toolsMetadata = {
  ...drawToolsMetadata,
  ...shapeToolsMetadata,
} as const;

export const isDrawTool = (toolId: ToolId): toolId is DrawToolId =>
  toolId in drawToolsMetadata;

export const isShapeTool = (toolId: ToolId): toolId is ShapeToolId =>
  toolId in shapeToolsMetadata;

