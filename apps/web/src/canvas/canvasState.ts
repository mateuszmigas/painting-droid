import type { Rectangle } from "@/utils/common";
import type { ImageCompressedData } from "@/utils/imageData";

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
  capturedBox: Rectangle | null;
};

export type CanvasState = {
  activeLayerIndex: number;
  layers: CanvasLayer[];
  overlayShape: CanvasOverlayShape | null;
};

export const defaultLayer: CanvasLayer = {
  id: "default",
  name: "Background",
  visible: true,
  locked: false,
  data: null,
};

export const defaultCanvasState: CanvasState = {
  activeLayerIndex: 0,
  layers: [defaultLayer],
  overlayShape: {
    type: "rectangle",
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    capturedBox: null,
  },
};
