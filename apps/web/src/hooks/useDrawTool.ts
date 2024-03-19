import type { CanvasContext, Position } from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { assertNever } from "@/utils/typeGuards";
import type { DrawToolId } from "@/tools/draw-tools";
import { BrushDrawTool } from "@/tools/draw-tools/brushDrawTool";
import type { DrawTool } from "@/tools/draw-tools/drawTool";
import { PencilDrawTool } from "@/tools/draw-tools/pencilDrawTool";
import type { ContextGuard } from "./useCanvasContextGuard";
import { toolsMetadata } from "@/tools";
import { createRaf } from "@/utils/frame";

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

export const useDrawTool = (
  elementRef: RefObject<HTMLElement>,
  drawToolId: DrawToolId | null,
  drawToolSettings: Record<string, unknown>,
  transformToCanvasPosition: (position: Position) => Position,
  contextGuard: ContextGuard,
  enable: boolean
) => {
  const toolRef = useRef<DrawTool | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!elementRef.current || !enable || drawToolId === null) return;

    const element = elementRef.current;
    toolRef.current = createTool(drawToolId, contextGuard.getContext());
    toolRef.current.configure(drawToolSettings);
    const tool = toolRef.current;
    let ticksCount = 0;
    let isDrawing = false;
    let currentPointerPosition: Position | null = null;

    const getPointerPosition = (event: PointerEvent) =>
      transformToCanvasPosition({ x: event.offsetX, y: event.offsetY });

    const { start, stop, cancel } = createRaf((time) => {
      tool.draw({
        position: currentPointerPosition!,
        sinceLastTickMs: time,
        ticksCount: ticksCount++,
      });
    });

    const pointerDownHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.button !== 0) return;

      currentPointerPosition = getPointerPosition(event);
      isDrawing = true;
      start();
    };

    const pointerUpHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isDrawing) return;
      stop();
      tool.reset();
      isDrawing = false;
      const { name, icon } = toolsMetadata[drawToolId!];
      contextGuard.applyChanges(name, icon);
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
        contextGuard.rejectChanges();
      }
    };

    element.addEventListener("pointerdown", pointerDownHandler);
    element.addEventListener("pointermove", pointerMoveHandler);
    document.addEventListener("pointerup", pointerUpHandler);
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      cancel();
      tool.reset();
      element.removeEventListener("pointerdown", pointerDownHandler);
      element.removeEventListener("pointermove", pointerMoveHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [drawToolId, contextGuard, elementRef, transformToCanvasPosition, enable]);

  useEffect(() => {
    toolRef.current?.configure(drawToolSettings);
  }, [drawToolSettings]);
};
