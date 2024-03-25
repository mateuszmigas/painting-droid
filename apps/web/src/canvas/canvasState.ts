import { getTranslations } from "@/translations";
import type { Rectangle } from "@/utils/common";
import type { ImageCompressedData } from "@/utils/imageData";

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

export type CanvasOverlayShape = {
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
  overlayShape: CanvasOverlayShape | null;
};

export const defaultLayer: CanvasLayer = {
  id: "default",
  name: translations.layers.defaultBaseName,
  visible: true,
  locked: false,
  data: null,
};

export const defaultCanvasState: CanvasState = {
  activeLayerIndex: 0,
  layers: [defaultLayer],
  overlayShape: null,
};
