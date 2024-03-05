import { DrawContext } from "@/drawing-tools/drawContext";
import { Size } from "@/utils/common";
import { Viewport } from "@/utils/manipulation";
import { RefObject, useEffect, useRef } from "react";

const applyTransform = (viewport: Viewport, element: HTMLElement) => {
  element.style.transform = `
      translate(${viewport.position.x}px, ${viewport.position.y}px) 
      scale(${viewport.zoom})
    `;
};

export const useCanvasRenderer = (
  hostElementRef: RefObject<HTMLElement>,
  size: Size
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<OffscreenCanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!hostElementRef.current || canvasRef.current) return;

    const hostElement = hostElementRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.className =
      "pixelated-canvas bg-gray-100 pointer-events-none origin-top-left shadow-sm";
    hostElement.appendChild(canvas);
    canvasRef.current = canvas;
    const offscreenCanvas = canvasRef.current?.transferControlToOffscreen();
    const context = offscreenCanvas?.getContext("2d");
    if (!context) {
      throw new Error("Canvas context is null");
    }

    contextRef.current = context;

    return () => {
      hostElement.removeChild(canvas);
      canvasRef.current = null;
    };
  }, [hostElementRef]);

  return {
    getLayerState: (_layerId: string) => "dupa123",
    setLayerState: (_layerId: string, _compressedImage: string) => {},
    getDrawContext: (_layerId: string): DrawContext => {
      return contextRef.current! as never as DrawContext;
    },
    getLayerData: () => {},
    getLayerDataUrl: () => {},
    setViewport: (viewport: Viewport) => {
      canvasRef.current && applyTransform(viewport, canvasRef.current);
    },
  };
};

