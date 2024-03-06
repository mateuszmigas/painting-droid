import { CanvasContext, Position } from "@/utils/common";
import { RefObject, useEffect, useRef } from "react";
import { assertNever } from "@/utils/typeGuards";
import { DrawToolId } from "@/tools/draw-tools";
import { BrushDrawTool } from "@/tools/draw-tools/brushDrawTool";
import { DrawTool } from "@/tools/draw-tools/drawTool";
import { PencilDrawTool } from "@/tools/draw-tools/pencilDrawTool";

const createTool = (id: DrawToolId, context: CanvasContext) => {
  switch (id) {
    case "pencil":
      return new PencilDrawTool(context);
    case "brush":
      return new BrushDrawTool(context);
    default:
      return assertNever(id);
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
  drawToolId: DrawToolId | null,
  drawToolSettings: Record<string, unknown>,
  transformToCanvasPosition: (position: Position) => Position,
  getCanvasContext: () => CanvasContext
) => {
  let toolRef = useRef<DrawTool | null>(null);

  useEffect(() => {
    if (!elementRef.current || drawToolId === null) return;

    const element = elementRef.current;
    toolRef.current = createTool(drawToolId, getCanvasContext());

    if (!toolRef.current) return;

    const tool = toolRef.current;
    tool.configure(drawToolSettings);
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
      getCanvasContext().save();
      currentMousePosition = getMousePosition(event);
      start();
    };
    const mouseUpHandler = (event: MouseEvent) => {
      if (!isDrawing) return;
      currentMousePosition = getMousePosition(event);
      stop();
      tool.reset();
      isDrawing = false;
      getCanvasContext().restore();
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
  }, [drawToolId]);

  useEffect(() => {
    toolRef.current && toolRef.current.configure(drawToolSettings);
  }, [drawToolSettings]);
};
