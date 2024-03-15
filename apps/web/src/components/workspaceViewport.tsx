import { type Viewport, calculateFitViewport } from "@/utils/manipulation";
import { memo, useRef } from "react";
import { useObservableWatcher, useAfterPaintEffect } from "@/hooks";
import { Ruler } from "./Ruler";
import {
  activeWorkspaceSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import { deepEqual } from "@/utils/object";
import type { Observable } from "@/utils/observable";
import { useDebounceListener } from "@/hooks/useDebounceListener";
import { CanvasViewport } from "./canvasViewport";

export const WorkspaceViewport = memo(() => {
  const rootElementRef = useRef<HTMLDivElement>(null);
  const activeWorkspaceId = useWorkspacesStore(
    (store) => store.activeWorkspaceId
  );
  const setWorkspaceViewport = useWorkspacesStore(
    (store) => store.setWorkspaceViewport
  );
  const workspaceViewport = useWorkspacesStore(
    (store) => activeWorkspaceSelector(store).viewport
  );
  const workspaceSize = useWorkspacesStore(
    (store) => activeWorkspaceSelector(store).size
  );
  const observableViewport = useObservableWatcher<Viewport | null>(
    workspaceViewport,
    deepEqual
  );

  useDebounceListener(
    observableViewport,
    (newViewport) => {
      if (deepEqual(newViewport, workspaceViewport)) return;
      setWorkspaceViewport(newViewport as Viewport);
    },
    500
  );

  useAfterPaintEffect(() => {
    if (!rootElementRef.current || observableViewport.getValue() !== null)
      return;

    const { width, height } = rootElementRef.current.getBoundingClientRect();
    const margin = Math.min(width, height) * 0.1;
    const viewport = calculateFitViewport(
      { width, height },
      { x: 0, y: 0, ...workspaceSize },
      margin
    );
    setWorkspaceViewport(viewport);
  }, [activeWorkspaceId]);

  return (
    <div className="flex flex-col relative size-full">
      <div
        id="workspace-viewport"
        ref={rootElementRef}
        className="relative flex-1 min-h-0 transition-opacity duration-1000"
      >
        {observableViewport.getValue() !== null && (
          <>
            <CanvasViewport
              key={activeWorkspaceId}
              viewport={observableViewport as Observable<Viewport>}
              size={workspaceSize}
            />
            <Ruler
              observableViewport={observableViewport as Observable<Viewport>}
            />
          </>
        )}
      </div>
    </div>
  );
});
