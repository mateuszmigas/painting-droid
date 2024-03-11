import { type Viewport, screenToViewportPosition } from "@/utils/manipulation";
import { memo, useEffect, useRef, useState } from "react";
import {
  useCanvasRenderer,
  useViewportManipulator,
  useDrawTool,
  useCanvasContextDispatcher,
  useListener,
} from "@/hooks";
import { useToolStore } from "@/store/toolState";
import type { Observable } from "@/utils/observable";
import type { WorkspaceId } from "@/store/workspacesStore";
//temp
const size = {
  width: 800,
  height: 600,
};
export const CanvasHost = memo(
  (props: { workspaceId: WorkspaceId; viewport: Observable<Viewport> }) => {
    const { workspaceId, viewport } = props;
    const [isRestored, setIsRestored] = useState(false);
    const hostElementRef = useRef<HTMLDivElement>(null);
    const renderer = useCanvasRenderer(hostElementRef, size);
    const dispatcher = useCanvasContextDispatcher(
      props.workspaceId,
      renderer.getDrawContext()
    );

    useEffect(() => {
      dispatcher
        .restoreContext(workspaceId, renderer.getDrawContext())
        .then(() => setIsRestored(true));
    }, [workspaceId, renderer, dispatcher]);

    const toolId = useToolStore((state) => state.selectedToolId);
    const toolSettings = useToolStore((state) => state.toolSettings[toolId]);

    useDrawTool(
      hostElementRef,
      toolId,
      toolSettings,
      (position) => screenToViewportPosition(position, viewport.getValue()),
      dispatcher,
      isRestored
    );

    useListener(viewport, (newViewport) => renderer.setViewport(newViewport), {
      triggerOnMount: true,
    });

    useViewportManipulator(
      hostElementRef,
      () => viewport.getValue(),
      (newViewport) => viewport.setValue(newViewport)
    );

    return (
      <div
        ref={hostElementRef}
        style={{ opacity: isRestored ? "1" : "0" }}
        className="absolute size-full overflow-hidden cursor-crosshair duration-1000"
      />
    );
  }
);

