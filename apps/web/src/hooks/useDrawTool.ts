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
import { subscribeToManipulationEvents } from "@/utils/manipulation/manipulationEvents";
import { useStableCallback } from ".";

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
  const transformToCanvasPositionStable = useStableCallback(
    transformToCanvasPosition
  );

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

    const { start, stop, cancel } = createRaf((time) => {
      tool.draw({
        position: currentPointerPosition!,
        sinceLastTickMs: time,
        ticksCount: ticksCount++,
      });
    });

    const onManipulationStart = (position: Position) => {
      currentPointerPosition = transformToCanvasPositionStable(position);
      isDrawing = true;
      start();
    };

    const onManipulationUpdate = (position: Position) => {
      if (!isDrawing) return;
      currentPointerPosition = transformToCanvasPositionStable(position);
    };

    const onManipulationEnd = () => {
      if (!isDrawing) return;
      stop();
      tool.reset();
      isDrawing = false;
      const { name, icon } = toolsMetadata[drawToolId!];
      contextGuard.applyChanges(name, icon);
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDrawing) {
        stop();
        tool.reset();
        isDrawing = false;
        contextGuard.rejectChanges();
      }
    };

    const unsubscribeManipulationEvents = subscribeToManipulationEvents(
      element,
      onManipulationStart,
      onManipulationUpdate,
      onManipulationEnd
    );

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      cancel();
      tool.reset();
      document.removeEventListener("keydown", keyDownHandler);
      unsubscribeManipulationEvents();
    };
  }, [
    drawToolId,
    contextGuard,
    elementRef,
    transformToCanvasPositionStable,
    enable,
  ]);

  useEffect(() => {
    toolRef.current?.configure(drawToolSettings);
  }, [drawToolSettings]);
};
