import { Viewport, screenToViewportPosition } from "@/utils/manipulation";
import { memo, useEffect, useRef, useState } from "react";
import {
  useCanvasRenderer,
  useViewportManipulator,
  useDrawTool,
  useCanvasHistory,
  useListener,
} from "@/hooks";
import { useToolStore } from "@/store/toolState";
import { Observable } from "@/utils/observable";
//temp
const size = {
  width: 800,
  height: 600,
};
const layerId = "1";

export const CanvasHost = memo((props: { viewport: Observable<Viewport> }) => {
  const { viewport } = props;
  const [visible, setVisible] = useState(false);
  const hostElementRef = useRef<HTMLDivElement>(null);
  const renderer = useCanvasRenderer(hostElementRef, size);
  const { commitChanges, revertChanges } = useCanvasHistory();

  const toolId = useToolStore((state) => state.selectedToolId);
  const toolSettings = useToolStore((state) => state.toolSettings[toolId]);
  useDrawTool(
    hostElementRef,
    toolId,
    toolSettings,
    (position) => screenToViewportPosition(position, viewport.getValue()),
    () => renderer.getDrawContext(layerId),
    commitChanges,
    revertChanges
  );

  useListener(viewport, (newViewport) => renderer.setViewport(newViewport), {
    triggerOnMount: true,
  });

  useViewportManipulator(
    hostElementRef,
    () => viewport.getValue(),
    (newViewport) => viewport.setValue(newViewport)
  );

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      ref={hostElementRef}
      style={{ opacity: visible ? "1" : "0" }}
      className="absolute size-full overflow-hidden cursor-crosshair duration-1000"
    ></div>
  );
});

