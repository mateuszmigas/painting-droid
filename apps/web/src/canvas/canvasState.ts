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

export type CanvasState = {
  activeLayerIndex: number;
  layers: CanvasLayer[];
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
};

