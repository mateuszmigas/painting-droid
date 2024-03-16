import { rectangleSelectToolMetadata } from "./rectangleSelectTool";

export const shapeToolsMetadata = {
  rectangleSelect: rectangleSelectToolMetadata,
} as const;

export type ShapeToolId = keyof typeof shapeToolsMetadata;

export const getDefaultShapeToolSettings = (_: ShapeToolId) => ({});

