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
  useObservable,
} from "@/hooks";
import { useToolStore } from "@/store/toolState";
import { Ruler } from "./Ruler";
import { useResizeObserver } from "@/hooks/useResizeObserver";

//temp
const size = {
  width: 1000,
  height: 1000,
};
const layerId = "1";

export const CanvasViewport = () => {
  const rootElementRef = useRef<HTMLDivElement>(null);
  const hostElementRef = useRef<HTMLDivElement>(null);
  const viewport = useObservable<Viewport>(defaultViewport);
  const renderer = useCanvasRenderer(hostElementRef, size);
  const drawToolId = useToolStore((state) => state.selectedToolId);
  const drawToolSettings = useToolStore(
    (state) => state.toolSettings[drawToolId]
  );

  useDrawTool(
    hostElementRef,
    drawToolId,
    drawToolSettings,
    (position) => screenToViewportPosition(position, viewport.getValue()),
    () => renderer.getDrawContext(layerId)
  );

  const updateViewport = (partialViewport: Partial<Viewport>) => {
    const newViewport = {
      ...viewport.getValue(),
      ...partialViewport,
    };
    viewport.setValue(newViewport);
    renderer.setViewport(newViewport);
  };

  useViewportManipulator(
    hostElementRef,
    () => viewport.getValue(),
    updateViewport
  );

  useResizeObserver(hostElementRef, (newSize) =>
    updateViewport({ size: newSize })
  );

  useFitToViewport(hostElementRef, size, (newViewport) => {
    updateViewport(newViewport);
    rootElementRef.current!.style.opacity = "1";
  });

  return (
    <div
      ref={rootElementRef}
      style={{ opacity: 0 }}
      className="relative size-full transition-opacity duration-1000"
    >
      <div
        ref={hostElementRef}
        className="absolute size-full overflow-hidden cursor-crosshair"
      ></div>
      <Ruler viewport={viewport}></Ruler>
    </div>
  );
};
