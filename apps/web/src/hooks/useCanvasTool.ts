import type {
  CanvasBitmapContext,
  CanvasVectorContext,
  Position,
} from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { assertNever } from "@/utils/typeGuards";
import type { CanvasToolId } from "@/tools/draw-tools";
import { BrushDrawTool } from "@/tools/draw-tools/brushDrawTool";
import type { CanvasTool } from "@/tools/draw-tools/canvasTool";
import { PencilDrawTool } from "@/tools/draw-tools/pencilDrawTool";
import { subscribeToManipulationEvents } from "@/utils/manipulation/manipulationEvents";
import { useStableCallback } from ".";
import { EraserDrawTool } from "@/tools/draw-tools/eraserDrawTool";
import { FillDrawTool } from "@/tools/draw-tools/fillDrawTool";
import { RectangleSelectTool } from "@/tools/draw-tools/rectangleSelectionDrawTool";
import {
  ShapeTransformer,
  isPositionInsideShape,
} from "@/tools/shapeTransformer";
import { useToolHandlers } from "./useCanvasToolHandlers";
import { useCanvasContextStore } from "@/contexts/canvasContextStore";
import type { CanvasOverlayShape } from "@/canvas/canvasState";

const createTool = (
  id: CanvasToolId,
  bitmapContext: CanvasBitmapContext,
  vectorContext: CanvasVectorContext
) => {
  switch (id) {
    case "pencil":
      return new PencilDrawTool(bitmapContext);
    case "brush":
      return new BrushDrawTool(bitmapContext);
    case "eraser":
      return new EraserDrawTool(bitmapContext);
    case "fill":
      return new FillDrawTool(bitmapContext);
    case "rectangleSelect":
      return new RectangleSelectTool(vectorContext);
    default:
      return assertNever(id);
  }
};

export const useTool = (
  elementRef: RefObject<HTMLElement>,
  toolId: CanvasToolId | null,
  toolSettings: Record<string, unknown>,
  transformToCanvasPosition: (position: Position) => Position,
  enable: boolean
) => {
  const { context } = useCanvasContextStore();
  const toolRef = useRef<CanvasTool | null>(null);
  const previousToolId = useRef<CanvasToolId | null>(null);
  const toolHandlers = useToolHandlers();
  const transformToCanvasPositionStable = useStableCallback(
    transformToCanvasPosition
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
    const tool: CanvasTool = createTool(toolId, context.bitmap, context.vector);
    tool.configure(toolSettings as never);
    tool.onCommit((result) => toolHandlers.commitDraw(toolId!, result));
    toolRef.current = tool;
    let operation: "draw" | "transform" | null = null;

    const reset = () => {
      tool.reset();
      shapeTransformer.reset();
      operation = null;
    };

    const onManipulationStart = (position: Position) => {
      const currentPosition = transformToCanvasPositionStable(position);
      const selectedShape = toolHandlers.getShape();

      if (
        selectedShape &&
        isPositionInsideShape(currentPosition, selectedShape)
      ) {
        operation = "transform";
        shapeTransformer.setTarget(selectedShape);
        shapeTransformer.update(currentPosition);
      } else {
        if (selectedShape) {
          console.log("unselect");
          toolHandlers.cancelTransform();
        }
        console.log("outside");
        operation = "draw";
        tool.processEvent({
          type: "manipulationStart",
          position: currentPosition,
        });
      }
    };

    const onManipulationUpdate = (position: Position) => {
      const currentPosition = transformToCanvasPositionStable(position);

      if (operation === "draw") {
        tool.processEvent({
          type: "manipulationStep",
          position: currentPosition,
        });
      }
      if (operation === "transform") {
        console.log("transforming");
        shapeTransformer.update(currentPosition);
        // console.log(shapeTransformer.getShape()?.boundingBox);
        context.vector?.render(
          shapeTransformer.getShape() as CanvasOverlayShape
        );
      }
    };

    const onManipulationEnd = (position: Position) => {
      if (operation === "draw") {
        tool.processEvent({
          type: "manipulationEnd",
          position: transformToCanvasPositionStable(position),
        });
      }
      if (operation === "transform") {
        console.log("transform");
        toolHandlers.transform(
          shapeTransformer.getShape() as CanvasOverlayShape
        );
      }
      reset();
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        reset();
        toolHandlers.cancel();
      }
      if (event.key === "Enter") {
        toolHandlers.applyTransform();
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
    transformToCanvasPositionStable,
    enable,
  ]);

  useEffect(() => {
    if (toolId === previousToolId.current) {
      toolRef.current?.configure(toolSettings);
    }
    previousToolId.current = toolId;
  }, [toolSettings, toolId]);
};

