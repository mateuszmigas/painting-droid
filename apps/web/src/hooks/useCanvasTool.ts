import type {
  CanvasBitmapContext,
  CanvasContext,
  CanvasVectorContext,
  Position,
} from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { assertNever } from "@/utils/typeGuards";
import type { CanvasToolId } from "@/tools";
import { BrushDrawTool } from "@/tools/brushDrawTool";
import type { CanvasTool } from "@/tools/canvasTool";
import { PencilDrawTool } from "@/tools/pencilDrawTool";
import { subscribeToManipulationEvents } from "@/utils/manipulation/manipulationEvents";
import { useStableCallback } from ".";
import { EraserDrawTool } from "@/tools/eraserDrawTool";
import { FillDrawTool } from "@/tools/fillDrawTool";
import { RectangleSelectTool } from "@/tools/rectangleSelectTool";
import { ShapeTransformer } from "@/tools/shapeTransformer";
import { useCanvasToolHandlers } from "./useCanvasToolHandlers";
import { isPositionInRectangle } from "@/utils/geometry";
import { SprayDrawTool } from "@/tools/sprayDrawTool";

const createTool = (
  id: CanvasToolId,
  bitmapContext: CanvasBitmapContext,
  vectorContext: CanvasVectorContext
): CanvasTool => {
  switch (id) {
    case "pencil":
      return new PencilDrawTool(bitmapContext);
    case "brush":
      return new BrushDrawTool(bitmapContext);
    case "eraser":
      return new EraserDrawTool(bitmapContext);
    case "fill":
      return new FillDrawTool(bitmapContext);
    case "spray":
      return new SprayDrawTool(bitmapContext);
    case "rectangleSelect":
      return new RectangleSelectTool(vectorContext);
    default:
      return assertNever(id);
  }
};

export const useCanvasTool = (
  elementRef: RefObject<HTMLElement>,
  toolId: CanvasToolId | null,
  toolSettings: Record<string, unknown>,
  screenToCanvasConverter: (position: Position) => Position,
  context: CanvasContext,
  enable: boolean
) => {
  const toolRef = useRef<CanvasTool | null>(null);
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
    const tool = createTool(toolId, context.bitmap, context.vector);
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

