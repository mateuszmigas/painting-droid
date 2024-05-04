import type {
  CanvasRasterContext,
  CanvasVectorContext,
  Position,
} from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { assertNever } from "@/utils/typeGuards";
import type { DrawToolId } from "@/tools/draw-tools";
import { BrushDrawTool } from "@/tools/draw-tools/brushDrawTool";
import type { DrawTool, DrawToolResult } from "@/tools/draw-tools/drawTool";
import { PencilDrawTool } from "@/tools/draw-tools/pencilDrawTool";
import { subscribeToManipulationEvents } from "@/utils/manipulation/manipulationEvents";
import { useStableCallback } from ".";
import { EraserDrawTool } from "@/tools/draw-tools/eraserDrawTool";
import { FillDrawTool } from "@/tools/draw-tools/fillDrawTool";
import { RectangleSelectTool } from "@/tools/draw-tools/rectangleSelectionDrawTool";
import { ShapeTransformer } from "@/tools/shapeTransformer";
import type { CanvasOverlayShape } from "@/canvas/canvasState";

const createTool = (
  id: DrawToolId,
  rasterContext: CanvasRasterContext,
  vectorContext: CanvasVectorContext
) => {
  switch (id) {
    case "pencil":
      return new PencilDrawTool(rasterContext);
    case "brush":
      return new BrushDrawTool(rasterContext);
    case "eraser":
      return new EraserDrawTool(rasterContext);
    case "fill":
      return new FillDrawTool(rasterContext);
    case "rectangleSelect":
      return new RectangleSelectTool(vectorContext);
    default:
      return assertNever(id);
  }
};

export const useTool = (
  elementRef: RefObject<HTMLElement>,
  toolId: DrawToolId | null,
  toolSettings: Record<string, unknown>,
  canvasRasterContext: CanvasRasterContext | null,
  canvasVectorContext: CanvasVectorContext | null,
  getCurrentShape: () => CanvasOverlayShape | null,
  transformToCanvasPosition: (position: Position) => Position,
  handlers: {
    cancel: () => Promise<void>;
    commitDraw: (
      drawToolId: DrawToolId,
      result?: DrawToolResult
    ) => Promise<void>;
    commitTransform: (shape: CanvasOverlayShape | null) => Promise<void>;
  },
  enable: boolean
) => {
  const toolRef = useRef<DrawTool | null>(null);
  const previousToolId = useRef<DrawToolId | null>(null);
  const cancelStable = useStableCallback(handlers.cancel);
  const commitDrawStable = useStableCallback(handlers.commitDraw);
  const commitTransformStable = useStableCallback(handlers.commitTransform);
  const getCurrentShapeStable = useStableCallback(getCurrentShape);
  const transformToCanvasPositionStable = useStableCallback(
    transformToCanvasPosition
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      !elementRef.current ||
      toolId === null ||
      canvasRasterContext === null ||
      canvasVectorContext === null ||
      !enable
    ) {
      return;
    }

    const element = elementRef.current;
    const shapeTransformer = new ShapeTransformer();
    const tool: DrawTool = createTool(
      toolId,
      canvasRasterContext,
      canvasVectorContext
    );
    tool.configure(toolSettings as never);
    tool.onCommit((result) => commitDrawStable(toolId!, result));
    toolRef.current = tool;
    let operation: "draw" | "transform" | null = null;

    const reset = () => {
      tool.reset();
      shapeTransformer.reset();
      operation = null;
    };

    const onManipulationStart = (position: Position) => {
      const currentPosition = transformToCanvasPositionStable(position);
      shapeTransformer.setTarget(getCurrentShapeStable());

      if (shapeTransformer.isInside(currentPosition)) {
        console.log("inside");
        operation = "transform";
        shapeTransformer.update(currentPosition);
      } else {
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
        canvasVectorContext.render(shapeTransformer.getShape());
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
        commitTransformStable(shapeTransformer.getShape());
        // shapeTransformer.apply();
      }
      reset();
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        //} && operation) {
        reset();
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
      reset();
      document.removeEventListener("keydown", keyDownHandler);
      unsubscribeManipulationEvents();
    };
  }, [
    toolId,
    cancelStable,
    commitDrawStable,
    commitTransformStable,
    canvasRasterContext,
    elementRef,
    transformToCanvasPositionStable,
    getCurrentShapeStable,
    enable,
  ]);

  useEffect(() => {
    if (toolId === previousToolId.current) {
      toolRef.current?.configure(toolSettings);
    }
    previousToolId.current = toolId;
  }, [toolSettings, toolId]);
};

