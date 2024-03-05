import { Viewport, defaultViewport } from "@/utils/manipulation";
import { useRef } from "react";
import { DrawingToolConfig } from "@/drawing-tools";
import { useCanvasRenderer } from "@/hooks/useCanvasRenderer";
import { useViewportManipulator } from "@/hooks/useViewportManipulator";
import { useFitCanvasToViewport as useFitToViewportOnInit } from "@/hooks/useFitToViewportOnInit";
import { useDrawTool } from "@/hooks/useDrawTool";

const toolConfig: DrawingToolConfig = {
  type: "pen",
  settings: {
    color: "blue",
    size: 4,
  },
};

const size = {
  width: 1000,
  height: 1000,
};

const layerId = "1";

export const CanvasViewport = () => {
  const hostElementRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<Viewport>(defaultViewport);
  const renderer = useCanvasRenderer(hostElementRef, size);

  useDrawTool(
    hostElementRef,
    toolConfig,
    (position) => {
      const viewport = viewportRef.current!;
      return {
        x: (position.x - viewport.position.x) / viewport.zoom,
        y: (position.y - viewport.position.y) / viewport.zoom,
      };
    },
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
