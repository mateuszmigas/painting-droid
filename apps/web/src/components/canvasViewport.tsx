import { Viewport, defaultViewport } from "@/utils/manipulation";
import { useEffect, useRef } from "react";
import { DrawingToolConfig } from "@/drawing-tools";
import { useCanvasRenderer } from "@/hooks/useCanvasRenderer";
import { useViewportManipulator } from "@/hooks/useViewportManipulator";
import { useFitToViewport as useFitToViewportOnInit } from "@/hooks/useFitToViewportOnInit";
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

  useViewportManipulator(
    hostElementRef,
    () => viewportRef.current,
    (viewport) => {
      viewportRef.current = viewport;
      renderer.setViewport(viewport);
    }
  );

  useFitToViewportOnInit(hostElementRef, (viewport) => {
    viewportRef.current = viewport;
    renderer.setViewport(viewport);
    hostElementRef.current?.classList.remove("hidden");
  });

  useEffect(() => {
    //draw some init data
  }, []);

  return (
    <div className="relative size-full">
      <div
        ref={hostElementRef}
        className="absolute size-full overflow-hidden hidden"
      ></div>
      <div className="absolute p-small">Middle mouse to move/zoom</div>
    </div>
  );
};

