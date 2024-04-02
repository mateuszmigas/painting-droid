import type { CanvasLayer, CanvasState } from "@/canvas/canvasState";
import { blobToDataUrl } from "./image";
import type { Size } from "./common";
import { dataUrlToBlob } from "./image";

export const encodePwd = async (
  canvasData: CanvasState,
  version: number,
  size: Size
) => {
  //todo: better storage
  const convertedLayers: CanvasLayer[] = [];
  for (let i = 0; i < canvasData.layers.length; i++) {
    const layer = canvasData.layers[i];
    const data =
      layer.data !== null
        ? {
            ...layer.data,
            data: await blobToDataUrl(layer.data.data),
          }
        : null;

    convertedLayers.push({ ...layer, data: data as never });
  }

  const text = JSON.stringify({
    version,
    size,
    data: {
      ...canvasData,
      layers: convertedLayers,
    },
  });

  return text;
};

export const decodePwd = async (text: string) => {
  const {
    size,
    data: canvasData,
    version,
  } = JSON.parse(text) as {
    version: number;
    size: Size;
    data: CanvasState;
  };

  for (let i = 0; i < canvasData.layers.length; i++) {
    const layer = canvasData.layers[i];
    layer.data =
      layer.data !== null
        ? {
            ...layer.data,
            data: await dataUrlToBlob(layer.data.data as unknown as string),
          }
        : null;
  }

  return {
    data: canvasData,
    version,
    size,
  };
};
