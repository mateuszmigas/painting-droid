import type { CanvasContext, Position } from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { canvasToolsMetadata, type CanvasToolId } from "@/tools";
import type { CanvasTool } from "@/tools/canvasTool";
import { subscribeToPointerEvents } from "@/utils/manipulation/pointerEvents";
import { useStableCallback } from ".";
import { ShapeTransformTool } from "@/tools/shapeTransformTool";
import { useCanvasToolHandlers } from "./useCanvasToolHandlers";

export const useCanvasTool = (
  elementRef: RefObject<HTMLElement>,
  toolId: CanvasToolId | null,
  toolSettings: Record<string, unknown>,
  screenToCanvasConverter: (position: Position) => Position,
  context: CanvasContext,
  enable: boolean
) => {
  const toolRef = useRef<CanvasTool<unknown> | null>(null);
  const previousToolId = useRef<CanvasToolId | null>(null);
  const toolHandlers = useCanvasToolHandlers();
  const screenToCanvasConverterStable = useStableCallback(
    screenToCanvasConverter
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: toolSettings is handled in next useEffect
  useEffect(() => {
    if (
      !elementRef.current ||
      toolId === null ||
      context.bitmap === null ||
      context.vector === null ||
      !enable
    ) {
      return;
    }

    const element = elementRef.current;
    const shapeTransformTool = new ShapeTransformTool(context.vector, () =>
      toolHandlers.getActiveShape()
    );
    const drawTool: CanvasTool<unknown> = canvasToolsMetadata[toolId].create({
      bitmap: context.bitmap,
      vector: context.vector,
    });
    drawTool.configure(toolSettings as never);
    drawTool.onCommit((result) => toolHandlers.toolCommit(toolId, result));
    toolRef.current = drawTool;

    const reset = () => {
      drawTool.reset();
      shapeTransformTool.reset();
    };

    const onPointerDown = (screenPosition: Position) => {
      const canvasPosition = screenToCanvasConverterStable(screenPosition);

      if (shapeTransformTool.beginTransform(canvasPosition, screenPosition)) {
        shapeTransformTool.stepTransform(canvasPosition);
      } else {
        if (toolHandlers.getActiveShape()) {
          toolHandlers.resolveActiveShape();
        } else {
          drawTool.processEvent({
            type: "pointerDown",
            canvasPosition,
            screenPosition,
          });
        }
      }
    };

    const onPointerMove = (screenPosition: Position) => {
      const canvasPosition = screenToCanvasConverterStable(screenPosition);

      if (shapeTransformTool.isTransforming()) {
        shapeTransformTool.stepTransform(canvasPosition);
      } else {
        drawTool.processEvent({
          type: "pointerMove",
          canvasPosition,
          screenPosition,
        });
      }
    };

    const onPointerUp = (screenPosition: Position) => {
      const canvasPosition = screenToCanvasConverterStable(screenPosition);

      if (shapeTransformTool.isTransforming()) {
        const result = shapeTransformTool.commitTransform();
        if (result) {
          toolHandlers.transformShape(result);
        }
      } else {
        drawTool.processEvent({
          type: "pointerUp",
          canvasPosition,
          screenPosition,
        });
      }
    };

    const onPointerLeave = () => {
      if (!shapeTransformTool.isTransforming()) {
        drawTool.processEvent({ type: "pointerLeave" });
      }
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        reset();
        toolHandlers.toolDiscard();
      }
      if (event.key === "Enter") {
        toolHandlers.resolveActiveShape();
      }
    };

    const unsubscribeManipulationEvents = subscribeToPointerEvents(
      element,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave
    );

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      reset();
      document.removeEventListener("keydown", keyDownHandler);
      unsubscribeManipulationEvents();
    };
  }, [
    toolId,
    toolHandlers,
    elementRef,
    context.bitmap,
    context.vector,
    screenToCanvasConverterStable,
    enable,
  ]);

  useEffect(() => {
    if (toolId === previousToolId.current) {
      toolRef.current?.configure(toolSettings);
    }
    previousToolId.current = toolId;
  }, [toolSettings, toolId]);
};

