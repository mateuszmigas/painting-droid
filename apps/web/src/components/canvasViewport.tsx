import {
  Viewport,
  defaultViewport,
  screenToViewportPosition,
} from "@/utils/manipulation";
import { useRef } from "react";
import {
  useCanvasRenderer,
  useViewportManipulator,
  useFitToViewport,
  useDrawTool,
} from "@/hooks";
import { useToolStore } from "@/store/toolState";

//temp
const size = {
  width: 1000,
  height: 1000,
};
const layerId = "1";

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
    (position) => screenToViewportPosition(position, viewportRef.current!),
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

  useFitToViewport(hostElementRef, size, (viewport) => {
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
