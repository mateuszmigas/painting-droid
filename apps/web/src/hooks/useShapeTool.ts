import type { CanvasOverlayShape } from "../canvas/canvasState";
import { RectangleSelectTool } from "../tools/shape-tools/rectangleSelectTool";
import type { ShapeToolId } from "@/tools/shape-tools";
import type { Position } from "@/utils/common";
import { type RefObject, useEffect } from "react";
import { assertNever } from "@/utils/typeGuards";
import { useStableCallback } from ".";
import { TransformShapeTool } from "@/tools/transformShapeTool";
import { subscribeToManipulationEvents } from "@/utils/manipulation/manipulationEvents";

const createDrawShapeTool = (id: ShapeToolId) => {
  switch (id) {
    case "rectangleSelect":
      return new RectangleSelectTool();
    default:
      return assertNever(id);
  }
};

type ShapeOperation = "draw" | "transform";

export const useShapeTool = (
  elementRef: RefObject<HTMLElement>,
  shapeToolId: ShapeToolId,
  transformToCanvasPosition: (position: Position) => Position,
  getCurrentShape: () => CanvasOverlayShape | null,
  handlers: {
    cancel: (shape: CanvasOverlayShape | null) => Promise<void>;
    update: (
      shape: CanvasOverlayShape | null,
      operation: ShapeOperation
    ) => Promise<void>;
    commit: (
      shape: CanvasOverlayShape | null,
      operation: ShapeOperation
    ) => Promise<void>;
  },
  enable: boolean
) => {
  const cancelStable = useStableCallback(handlers.cancel);
  const updateStable = useStableCallback(handlers.update);
  const commitStable = useStableCallback(handlers.commit);
  const getCurrentShapeStable = useStableCallback(getCurrentShape);
  const transformToCanvasPositionStable = useStableCallback(
    transformToCanvasPosition
  );

  useEffect(() => {
    if (!elementRef.current || !enable || shapeToolId === null) return;

    const element = elementRef.current;
    const drawShapeTool = createDrawShapeTool(shapeToolId);
    const transformShapeTool = new TransformShapeTool();
    let operation: ShapeOperation | null = null;
    let currentPointerPosition: Position | null = null;

    const update = () => {
      const payload = { position: currentPointerPosition! };
      if (operation === "draw") {
        drawShapeTool.update(payload);
        updateStable(drawShapeTool.getShape(), operation);
      }
      if (operation === "transform") {
        transformShapeTool.update(payload.position);
        updateStable(transformShapeTool.getShape(), operation!);
      }
    };

    const reset = () => {
      drawShapeTool.reset();
      transformShapeTool.reset();
      operation = null;
    };

    const cancelCurrent = () => cancelStable(getCurrentShapeStable());

    const onManipulationStart = (position: Position) => {
      currentPointerPosition = transformToCanvasPositionStable(position);
      transformShapeTool.setTarget(getCurrentShapeStable());

      if (transformShapeTool.isInside(currentPointerPosition)) {
        operation = "transform";
      } else {
        operation = "draw";
      }

      update();
    };

    const onManipulationEnd = () => {
      if (!operation) return;

      if (operation === "draw") {
        const drawnShape = drawShapeTool.getShape();
        drawnShape !== null
          ? commitStable(drawnShape, operation)
          : cancelCurrent();
      } else {
        const transformedShape = transformShapeTool.getShape();
        transformedShape !== null
          ? commitStable(transformedShape, operation)
          : cancelCurrent();
      }

      reset();
    };
    const onManipulationUpdate = (position: Position) => {
      if (!operation) return;
      currentPointerPosition = transformToCanvasPositionStable(position);
      update();
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        reset();
        cancelCurrent();
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
      document.removeEventListener("keydown", keyDownHandler);
      unsubscribeManipulationEvents();
    };
  }, [
    shapeToolId,
    enable,
    elementRef,
    cancelStable,
    updateStable,
    commitStable,
    getCurrentShapeStable,
    transformToCanvasPositionStable,
  ]);
};
