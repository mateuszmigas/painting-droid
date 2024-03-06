import { Viewport, defaultViewport } from "@/utils/manipulation";
import { useRef } from "react";
import { useCanvasRenderer } from "@/hooks/useCanvasRenderer";
import { useViewportManipulator } from "@/hooks/useViewportManipulator";
import { useFitCanvasToViewport as useFitToViewportOnInit } from "@/hooks/useFitToViewportOnInit";
import { useDrawTool } from "@/hooks/useDrawTool";
import { useToolStore } from "@/store/toolState";
import { Position } from "@/utils/common";

const size = {
  width: 1000,
  height: 1000,
};

const layerId = "1";

const screenPositionToCanvasPosition = (
  position: Position,
  viewport: Viewport
) => {
  return {
    x: (position.x - viewport.position.x) / viewport.zoom,
    y: (position.y - viewport.position.y) / viewport.zoom,
  };
};

export const CanvasViewport = () => {
  const hostElementRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<Viewport>(defaultViewport);
  const renderer = useCanvasRenderer(hostElementRef, size);
  const drawToolId = useToolStore((state) => state.selectedToolId);
  const drawToolSettings = useToolStore(
    (state) => state.toolSettings[drawToolId]
  );

  useDrawTool(
    hostElementRef,
    drawToolId,
    drawToolSettings,
    (position) =>
      screenPositionToCanvasPosition(position, viewportRef.current!),
    () => renderer.getDrawContext(layerId)
  );

  const updateViewport = (viewport: Viewport) => {
    viewportRef.current = viewport;
    renderer.setViewport(viewport);
  };

  useViewportManipulator(
    hostElementRef,
    () => viewportRef.current,
    updateViewport
  );

  useFitToViewportOnInit(hostElementRef, size, (viewport) => {
    updateViewport(viewport);
    hostElementRef.current!.style.opacity = "1";
  });

  return (
    <div className="relative size-full">
      <div
        style={{ opacity: 0 }}
        ref={hostElementRef}
        className="absolute size-full overflow-hidden transition-opacity duration-1000 cursor-crosshair"
      ></div>
      <div className="absolute p-small">Middle mouse to move/zoom</div>
    </div>
  );
};
