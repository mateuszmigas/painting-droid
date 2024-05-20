import { getTranslations } from "@/translations";
import type { RgbaColor } from "@/utils/color";
import type { Rectangle, Size } from "@/utils/common";
import type { ImageCompressedData } from "@/utils/imageData";
import { uuid } from "@/utils/uuid";

const translations = getTranslations();

export type CanvasLayerId = string;
export type CanvasLayerData = ImageCompressedData | null;
export type CanvasLayer = {
  id: CanvasLayerId;
  name: string;
  visible: boolean;
  locked: boolean;
  data: CanvasLayerData;
};

export type CanvasCapturedArea = { box: Rectangle; data: ImageCompressedData };
export type CanvasShape = {
  boundingBox: Rectangle;
  capturedArea?: CanvasCapturedArea;
} & (
  | {
      id: string;
      type: "captured-rectangle";
    }
  | {
      id: string;
      type: "rectangle" | "ellipse";
      fill: RgbaColor;
      stroke: { color: RgbaColor; width: RgbaColor };
    }
);

export type CanvasShapeId = string;

export type CanvasState = {
  activeLayerIndex: number;
  layers: CanvasLayer[];
  shapes: Record<CanvasShapeId, CanvasShape>;
  activeShapeId: CanvasShapeId | null;
  size: Size;
};

export const createDefaultLayer = (): CanvasLayer => ({
  id: uuid(),
  name: translations.layers.defaultBaseName,
  visible: true,
  locked: false,
  data: null,
});

export const createDefaultCanvasState = (size: Size): CanvasState => ({
  activeLayerIndex: 0,
  layers: [createDefaultLayer()],
  shapes: {},
  activeShapeId: null,
  size,
});

