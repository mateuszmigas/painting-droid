import { getTranslations } from "@/translations";
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

export type CanvasCapturedArea = {
  id: string;
  type: "rectangle";
  boundingBox: Rectangle;
  captured: {
    box: Rectangle;
    data: ImageCompressedData;
  } | null;
};

export type CanvasState = {
  activeLayerIndex: number;
  layers: CanvasLayer[];
  capturedArea: CanvasCapturedArea | null;
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
  capturedArea: null,
  size,
});

