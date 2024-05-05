import type { CanvasContext, Position } from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { canvasToolsMetadata, type CanvasToolId } from "@/tools";
import type { CanvasTool } from "@/tools/canvasTool";
import { subscribeToManipulationEvents } from "@/utils/manipulation/manipulationEvents";
import { useStableCallback } from ".";
import { ShapeTransformer } from "@/tools/shapeTransformer";
import { useCanvasToolHandlers } from "./useCanvasToolHandlers";
import { isPositionInRectangle } from "@/utils/geometry";

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
    const shapeTransformer = new ShapeTransformer();
    const tool: CanvasTool<unknown> = canvasToolsMetadata[toolId].create({
      bitmap: context.bitmap,
      vector: context.vector,
    });
    tool.configure(toolSettings as never);
    tool.onCommit((result) => toolHandlers.toolCommit(toolId, result));
    toolRef.current = tool;
    let currentOperation: "draw" | "transform" | null = null;

    const reset = () => {
      tool.reset();
      shapeTransformer.reset();
      currentOperation = null;
    };

    const onManipulationStart = (screenPosition: Position) => {
      const position = screenToCanvasConverterStable(screenPosition);
      const selectedShape = toolHandlers.getSelectedShape();

      if (
        selectedShape &&
        isPositionInRectangle(position, selectedShape.boundingBox)
      ) {
        currentOperation = "transform";
        shapeTransformer.setTarget(selectedShape);
        shapeTransformer.transform(position);
      } else {
        currentOperation = "draw";
        if (selectedShape) {
          toolHandlers.applyOrClearSelectedShape();
        }
        tool.processEvent({ type: "manipulationStart", position });
      }
    };

    const onManipulationUpdate = (screenPosition: Position) => {
      const position = screenToCanvasConverterStable(screenPosition);

      if (currentOperation === "draw") {
        tool.processEvent({ type: "manipulationStep", position });
      }
      if (currentOperation === "transform") {
        shapeTransformer.transform(position);
        const result = shapeTransformer.getResult();
        result && toolHandlers.drawSelectedShape(result);
      }
    };

    const onManipulationEnd = (screenPosition: Position) => {
      const position = screenToCanvasConverterStable(screenPosition);

      if (currentOperation === "draw") {
        tool.processEvent({ type: "manipulationEnd", position });
      }
      if (currentOperation === "transform") {
        const result = shapeTransformer.getResult();
        result && toolHandlers.transformSelectedShape(result);
      }
      reset();
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        reset();
        toolHandlers.cancel();
      }
      if (event.key === "Enter") {
        toolHandlers.applyOrClearSelectedShape();
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

