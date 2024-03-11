import type { CanvasContext, Position } from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { assertNever } from "@/utils/typeGuards";
import type { DrawToolId } from "@/tools/draw-tools";
import { BrushDrawTool } from "@/tools/draw-tools/brushDrawTool";
import type { DrawTool } from "@/tools/draw-tools/drawTool";
import { PencilDrawTool } from "@/tools/draw-tools/pencilDrawTool";
import type { CanvasContextDispatcher } from "./useCanvasContextDispatcher";

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
      callback(Date.now() - start, true);
      cancelAnimationFrame(rafHandle);
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
  dispatcher: CanvasContextDispatcher,
  isRestored: boolean
) => {
  const toolRef = useRef<DrawTool | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intended
  useEffect(() => {
    if (!elementRef.current || !isRestored || drawToolId === null) return;

    const element = elementRef.current;
    const contextLock = dispatcher.requestContextLock();
    toolRef.current = createTool(drawToolId, contextLock.getContext());
    toolRef.current.configure(drawToolSettings);
    const tool = toolRef.current;
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
      contextLock.applyChanges();
    };
    const pointerMoveHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isDrawing) return;
      currentPointerPosition = getPointerPosition(event);
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDrawing) {
        stop();
        tool.reset();
        isDrawing = false;
        contextLock.rejectChanges();
      }
    };

    element.addEventListener("pointerdown", pointerDownHandler);
    element.addEventListener("pointerup", pointerUpHandler);
    element.addEventListener("pointermove", pointerMoveHandler);
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      cancel();
      tool.reset();
      element.removeEventListener("pointerdown", pointerDownHandler);
      element.removeEventListener("pointerup", pointerUpHandler);
      element.removeEventListener("pointermove", pointerMoveHandler);
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [
    drawToolId,
    dispatcher,
    elementRef,
    transformToCanvasPosition,
    isRestored,
  ]);

  useEffect(() => {
    toolRef.current?.configure(drawToolSettings);
  }, [drawToolSettings]);
};

