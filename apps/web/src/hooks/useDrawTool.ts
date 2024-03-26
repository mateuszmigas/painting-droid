import type { CanvasContext, Position } from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { assertNever } from "@/utils/typeGuards";
import type { DrawToolId } from "@/tools/draw-tools";
import { BrushDrawTool } from "@/tools/draw-tools/brushDrawTool";
import type { DrawTool } from "@/tools/draw-tools/drawTool";
import { PencilDrawTool } from "@/tools/draw-tools/pencilDrawTool";
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
  activeContext: CanvasContext | null,
  transformToCanvasPosition: (position: Position) => Position,
  handlers: {
    cancel: () => Promise<void>;
    commit: (drawToolId: DrawToolId) => Promise<void>;
  },
  enable: boolean
) => {
  const toolRef = useRef<DrawTool | null>(null);
  const cancelStable = useStableCallback(handlers.cancel);
  const commitStable = useStableCallback(handlers.commit);
  const transformToCanvasPositionStable = useStableCallback(
    transformToCanvasPosition
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      !elementRef.current ||
      drawToolId === null ||
      activeContext === null ||
      !enable
    ) {
      return;
    }

    const element = elementRef.current;
    toolRef.current = createTool(drawToolId, activeContext);
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
      commitStable(drawToolId!);
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDrawing) {
        stop();
        tool.reset();
        isDrawing = false;
        cancelStable();
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
    cancelStable,
    commitStable,
    activeContext,
    elementRef,
    transformToCanvasPositionStable,
    enable,
  ]);

  useEffect(() => {
    toolRef.current?.configure(drawToolSettings);
  }, [drawToolSettings]);
};
