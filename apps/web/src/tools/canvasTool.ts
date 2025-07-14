import type { CanvasShape } from "@/canvas/canvasState";
import type { IconType } from "@/components/icons/icon";
import type { CanvasBitmapContext, CanvasVectorContext, Position } from "@/utils/common";
import type { CustomFieldsSchema, CustomFieldsSchemaAsValues } from "@/utils/customFieldsSchema";

type CanvasToolMetadata<TSchema extends CustomFieldsSchema> = {
  id: string;
  name: string;
  icon: IconType;
  settingsSchema: TSchema;
  create: (context: {
    bitmap: CanvasBitmapContext;
    vector: CanvasVectorContext;
  }) => CanvasTool<CustomFieldsSchemaAsValues<TSchema>>;
};

export type CanvasToolEvent =
  | { type: "pointerDown"; canvasPosition: Position; screenPosition: Position }
  | { type: "pointerMove"; canvasPosition: Position; screenPosition: Position }
  | { type: "pointerUp"; canvasPosition: Position; screenPosition: Position }
  | { type: "pointerLeave" };

export type CanvasToolResult = {
  shape?: CanvasShape;
  bitmapContextChanged?: boolean;
};

export interface CanvasTool<T> {
  configure(settings: T): void;
  processEvent(event: CanvasToolEvent): void;
  onCommit(callback: (result: CanvasToolResult) => void): void;
  reset(): void;
}

export type InferToolSettings<TSchema extends CustomFieldsSchema> = CustomFieldsSchemaAsValues<TSchema>;

export const createCanvasToolSettingsSchema = <TSchema extends CustomFieldsSchema>(schema: TSchema) => schema;

export const createCanvasToolMetadata = <TSchema extends CustomFieldsSchema>(metadata: CanvasToolMetadata<TSchema>) =>
  metadata;
