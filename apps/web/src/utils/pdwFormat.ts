import type { CanvasLayer, CanvasState } from "@/canvas/canvasState";
import type { Size } from "./common";
import { blobToDataUrl, dataUrlToBlob } from "./image";

export const encodePwd = async (canvasData: CanvasState, version: number) => {
  //todo: better storage
  const convertedLayers: CanvasLayer[] = [];
  for (let i = 0; i < canvasData.layers.length; i++) {
    const layer = canvasData.layers[i];
    const data = layer.data !== null ? await blobToDataUrl(layer.data) : null;
    convertedLayers.push({ ...layer, data: data as never });
  }

  const text = JSON.stringify({
    version,
    data: {
      ...canvasData,
      layers: convertedLayers,
    },
  });

  return text;
};

export const decodePwd = async (text: string) => {
  const { data: canvasData, version } = JSON.parse(text) as {
    version: number;
    size: Size;
    data: CanvasState;
  };

  for (let i = 0; i < canvasData.layers.length; i++) {
    const layer = canvasData.layers[i];
    layer.data = layer.data !== null ? await dataUrlToBlob(layer.data as unknown as string) : null;
  }

  return {
    data: canvasData,
    version,
  };
};
