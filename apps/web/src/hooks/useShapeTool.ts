import type { CanvasOverlayShape } from "../canvas/canvasState";
import { RectangleSelectTool } from "../tools/shape-tools/rectangleSelectTool";
import type { ShapeToolId } from "@/tools/shape-tools";
import type { Position } from "@/utils/common";
import { type RefObject, useEffect } from "react";
import { assertNever } from "@/utils/typeGuards";
import { useStableCallback } from ".";
import { ManipulateShapeTool } from "@/tools/manipulateTool";

const createDrawShapeTool = (id: ShapeToolId) => {
  switch (id) {
    case "rectangleSelect":
      return new RectangleSelectTool();
    default:
      return assertNever(id);
  }
};

export const useShapeTool = (
  elementRef: RefObject<HTMLElement>,
  shapeToolId: ShapeToolId,
  transformToCanvasPosition: (position: Position) => Position,
  getCurrentShape: () => CanvasOverlayShape | null,
  renderShape: (shape: CanvasOverlayShape | null) => void,
  commitShape: (shape: CanvasOverlayShape | null) => void,
  enable: boolean
) => {
  const renderStable = useStableCallback(renderShape);
  const commitStable = useStableCallback(commitShape);
  const getCurrentShapeStable = useStableCallback(getCurrentShape);
  const transformToCanvasPositionStable = useStableCallback(
    transformToCanvasPosition
  );
  useEffect(() => {
    if (!elementRef.current || !enable || shapeToolId === null) return;

    const element = elementRef.current;
    const drawShapeTool = createDrawShapeTool(shapeToolId);
    const manipulateShapeTool = new ManipulateShapeTool();
    let state: "draw" | "modify" | null = null;
    let currentPointerPosition: Position | null = null;

    const getPointerPosition = (event: PointerEvent) => {
      return transformToCanvasPositionStable({
        x: event.offsetX,
        y: event.offsetY,
      });
    };

    const update = () => {
      const payload = { position: currentPointerPosition! };
      if (state === "draw") {
        drawShapeTool.update(payload);
        renderStable(drawShapeTool.getShape());
      } else {
        manipulateShapeTool.update(payload.position);
        const currentShape = manipulateShapeTool.getShape();
        currentShape !== null && renderStable(currentShape);
      }
    };

    const reset = () => {
      drawShapeTool.reset();
      manipulateShapeTool.reset();
      state = null;
    };

    const pointerDownHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.button !== 0) return;

      currentPointerPosition = getPointerPosition(event);
      manipulateShapeTool.setTarget(getCurrentShapeStable());

      if (manipulateShapeTool.isInside(currentPointerPosition)) {
        state = "modify";
      } else {
        state = "draw";
      }

      update();
    };

    const pointerUpHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!state) return;

      if (state === "draw") {
        commitStable(drawShapeTool.getShape());
      } else {
        commitStable(manipulateShapeTool.getShape());
      }

      reset();
    };
    const pointerMoveHandler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!state) return;
      currentPointerPosition = getPointerPosition(event);
      update();
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        reset();
        renderStable(null);
      }
    };

    element.addEventListener("pointerdown", pointerDownHandler);
    element.addEventListener("pointermove", pointerMoveHandler);
    document.addEventListener("pointerup", pointerUpHandler);
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      element.removeEventListener("pointerdown", pointerDownHandler);
      element.removeEventListener("pointermove", pointerMoveHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [
    shapeToolId,
    enable,
    elementRef,
    renderStable,
    commitStable,
    getCurrentShapeStable,
    transformToCanvasPositionStable,
  ]);
};
