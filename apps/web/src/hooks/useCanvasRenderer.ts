import { CanvasContext, Size } from "@/utils/common";
import { Viewport } from "@/utils/manipulation";
import { RefObject, useEffect, useRef } from "react";

const alphaGridCellSize = 20;
const applyTransform = (viewport: Viewport, element: HTMLElement) => {
  element.style.transform = `
      translate(${viewport.position.x}px, ${viewport.position.y}px) 
      scale(${viewport.zoom})
    `;
  element.style.setProperty(
    "--alpha-background-size",
    `${alphaGridCellSize / viewport.zoom}px`
  );
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
    canvas.id = "canvas-renderer";
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.className =
      "pixelated-canvas pointer-events-none origin-top-left outline outline-border shadow-2xl box-content alpha-background";
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
    getDrawContext: (_layerId: string) =>
      contextRef.current! as never as CanvasContext,
    setViewport: (viewport: Viewport) => {
      canvasRef.current && applyTransform(viewport, canvasRef.current);
    },
  };
};
