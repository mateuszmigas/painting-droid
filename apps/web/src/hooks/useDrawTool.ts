import type {
  CanvasRasterContext,
  CanvasVectorContext,
  Position,
} from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { assertNever } from "@/utils/typeGuards";
import type { DrawToolId } from "@/tools/draw-tools";
import { BrushDrawTool } from "@/tools/draw-tools/brushDrawTool";
import type { DrawTool } from "@/tools/draw-tools/drawTool";
import { PencilDrawTool } from "@/tools/draw-tools/pencilDrawTool";
import { subscribeToManipulationEvents } from "@/utils/manipulation/manipulationEvents";
import { useStableCallback } from ".";
import { EraserDrawTool } from "@/tools/draw-tools/eraserDrawTool";

const createTool = (id: DrawToolId, rasterContext: CanvasRasterContext) => {
  switch (id) {
    case "pencil":
      return new PencilDrawTool(rasterContext);
    case "brush":
      return new BrushDrawTool(rasterContext);
    case "eraser":
      return new EraserDrawTool(rasterContext);
    default:
      return assertNever(id);
  }
};

export const useDrawTool = (
  elementRef: RefObject<HTMLElement>,
  toolId: DrawToolId | null,
  toolSettings: Record<string, unknown>,
  canvasRasterContext: CanvasRasterContext | null,
  _canvasVectorContext: CanvasVectorContext | null,
  transformToCanvasPosition: (position: Position) => Position,
  handlers: {
    cancel: () => Promise<void>;
    commit: (drawToolId: DrawToolId) => Promise<void>;
  },
  enable: boolean
) => {
  const toolRef = useRef<DrawTool | null>(null);
  const previousToolId = useRef<DrawToolId | null>(null);
  const cancelStable = useStableCallback(handlers.cancel);
  const commitStable = useStableCallback(handlers.commit);
  const transformToCanvasPositionStable = useStableCallback(
    transformToCanvasPosition
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      !elementRef.current ||
      toolId === null ||
      canvasRasterContext === null ||
      !enable
    ) {
      return;
    }

    const element = elementRef.current;
    toolRef.current = createTool(toolId, canvasRasterContext);
    toolRef.current.configure(toolSettings);
    const tool = toolRef.current;
    let isDrawing = false;

    const onManipulationStart = (position: Position) => {
      tool.processEvent({
        type: "manipulationStart",
        position: transformToCanvasPositionStable(position),
      });
      isDrawing = true;
    };

    const onManipulationUpdate = (position: Position) => {
      if (!isDrawing) return;
      tool.processEvent({
        type: "manipulationStep",
        position: transformToCanvasPositionStable(position),
      });
    };

    const onManipulationEnd = (position: Position) => {
      if (!isDrawing) return;
      tool.processEvent({
        type: "manipulationEnd",
        position: transformToCanvasPositionStable(position),
      });
      tool.reset();
      commitStable(toolId!);
      isDrawing = false;
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDrawing) {
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
      tool.reset();
      document.removeEventListener("keydown", keyDownHandler);
      unsubscribeManipulationEvents();
    };
  }, [
    toolId,
    cancelStable,
    commitStable,
    canvasRasterContext,
    elementRef,
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

