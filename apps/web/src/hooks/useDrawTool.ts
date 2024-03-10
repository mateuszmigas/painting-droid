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
  getCanvasContext: () => CanvasContext,
  _commitChanges: (context: CanvasContext) => void,
  _revertChanges: (context: CanvasContext) => void
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
    let currentPointerPosition: { x: number; y: number } | null = null;
    const getPointerPosition = (event: PointerEvent) => {
      return { x: event.offsetX, y: event.offsetY };
    };

    const { start, stop, cancel } = createRaf((time) => {
      tool.draw({
        position: transformToCanvasPosition(currentPointerPosition!),
        isLastTick: false,
        sinceLastTickMs: time,
        ticksCount,
      });
      ticksCount++;
    });

    const pointerDownHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.button !== 0) return;
      isDrawing = true;
      getCanvasContext().save();
      currentPointerPosition = getPointerPosition(event);
      start();
    };

    const pointerUpHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isDrawing) return;
      currentPointerPosition = getPointerPosition(event);
      stop();
      tool.reset();
      isDrawing = false;
      getCanvasContext().restore();
    };
    const pointerMoveHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isDrawing) return;
      currentPointerPosition = getPointerPosition(event);
    };

    element.addEventListener("pointerdown", pointerDownHandler);
    element.addEventListener("pointerup", pointerUpHandler);
    element.addEventListener("pointermove", pointerMoveHandler);

    return () => {
      cancel();
      tool.reset();
      element.removeEventListener("pointerdown", pointerDownHandler);
      element.removeEventListener("pointerup", pointerUpHandler);
      element.removeEventListener("pointermove", pointerMoveHandler);
    };
  }, [drawToolId]);

  useEffect(() => {
    toolRef.current && toolRef.current.configure(drawToolSettings);
  }, [drawToolSettings]);
};

