import { DrawingToolConfig } from "@/drawing-tools";
import { DrawContext } from "@/drawing-tools/drawContext";
import { DrawingTool } from "@/drawing-tools/drawTool";
import { PenDrawTool } from "@/drawing-tools/penTool";
import { Position } from "@/utils/common";
import { RefObject, useEffect, useRef } from "react";

const createTool = (tool: DrawingToolConfig, context: DrawContext) => {
  switch (tool.type) {
    case "pen":
      return new PenDrawTool(context);
    default:
      return null;
  }
};

const createRaf = (
  callback: (sinceLastTickMs: number, isLastTick?: boolean) => void
) => {
  let rafHandle = 0;
  let start = 0;

  return {
    start: () => {
      start = Date.now();
      const loop = (time: number) => {
        callback(time - start);
        rafHandle = requestAnimationFrame(loop);
      };
      rafHandle = requestAnimationFrame(loop);
    },
    stop: () => {
      cancelAnimationFrame(rafHandle);
      callback(Date.now() - start, true);
    },
    cancel: () => {
      cancelAnimationFrame(rafHandle);
    },
  };
};

export const useDrawTool = (
  elementRef: RefObject<HTMLElement>,
  toolConfig: DrawingToolConfig,
  transformToCanvasPosition: (position: Position) => Position,
  getDrawContext: () => DrawContext
) => {
  let toolRef = useRef<DrawingTool | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    toolRef.current = createTool(toolConfig, getDrawContext());

    if (!toolRef.current) return;

    const tool = toolRef.current;
    tool.configure(toolConfig.settings);
    let ticksCount = 0;
    let isDrawing = false;
    let currentMousePosition: { x: number; y: number } | null = null;
    const getMousePosition = (event: MouseEvent) => {
      return { x: event.offsetX, y: event.offsetY };
    };

    const { start, stop, cancel } = createRaf((time) => {
      tool.draw({
        position: transformToCanvasPosition(currentMousePosition!),
        isLastTick: false,
        sinceLastTickMs: time,
        ticksCount,
      });
      ticksCount++;
    });

    const mouseDownHandler = (event: MouseEvent) => {
      if (event.button !== 0) return;
      isDrawing = true;
      getDrawContext().save();
      currentMousePosition = getMousePosition(event);
      start();
    };
    const mouseUpHandler = (event: MouseEvent) => {
      if (!isDrawing) return;
      currentMousePosition = getMousePosition(event);
      stop();
      tool.reset();
      isDrawing = false;
      getDrawContext().restore();
    };
    const mouseMoveHandler = (event: MouseEvent) => {
      if (!isDrawing) return;
      currentMousePosition = getMousePosition(event);
    };

    element.addEventListener("mousedown", mouseDownHandler);
    element.addEventListener("mouseup", mouseUpHandler);
    element.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      cancel();
      tool.reset();
      element.removeEventListener("mousedown", mouseDownHandler);
      element.removeEventListener("mouseup", mouseUpHandler);
      element.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [toolConfig.type]);

  useEffect(() => {
    toolRef.current && toolRef.current.configure(toolConfig.settings);
  }, [toolConfig.settings]);
};

