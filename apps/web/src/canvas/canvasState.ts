import { defaultCanvasColor } from "@/constants";
import { getTranslations } from "@/translations";
import type { RgbaColor } from "@/utils/color";
import type { BoundingBox, Rectangle, Size } from "@/utils/common";
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
  boundingBox: BoundingBox;
  capturedArea?: CanvasCapturedArea;
} & (
  | {
      id: string;
      type: "generated-image";
      capturedArea: CanvasCapturedArea;
    }
  | {
      id: string;
      type: "dropped-image";
      capturedArea: CanvasCapturedArea;
    }
  | {
      id: string;
      type: "captured-area";
      capturedArea: CanvasCapturedArea;
    }
  | {
      id: string;
      type: "captured-rectangle";
      capturedArea: CanvasCapturedArea;
    }
  | {
      id: string;
      type: "drawn-rectangle";
      fill: RgbaColor;
      stroke: { color: RgbaColor; width: number };
    }
  | {
      id: string;
      type: "drawn-ellipse";
      fill: RgbaColor;
      stroke: { color: RgbaColor; width: number };
    }
);

export type CanvasShapeId = string;

export type CanvasState = {
  activeLayerIndex: number;
  layers: CanvasLayer[];
  shapes: Record<CanvasShapeId, CanvasShape>;
  activeShapeId: CanvasShapeId | null;
  size: Size;
  baseColor: RgbaColor | null;
};

export const createDefaultLayer = (): CanvasLayer => ({
  id: uuid(),
  name: translations.layers.defaultBaseName,
  visible: true,
  locked: false,
  data: null,
});

export const createDefaultCanvasState = (
  size: Size,
  baseColor?: RgbaColor | null
): CanvasState => ({
  activeLayerIndex: 0,
  layers: [createDefaultLayer()],
  shapes: {},
  activeShapeId: null,
  size,
  baseColor: baseColor !== undefined ? baseColor : defaultCanvasColor,
});

