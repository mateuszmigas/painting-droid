import { Viewport, calculateFitViewport } from "@/utils/manipulation";
import { memo, useRef } from "react";
import { useObservableWatcher, useAfterPaintEffect } from "@/hooks";
import { Ruler } from "./Ruler";
import {
  selectedWorkspaceSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import { deepEqual } from "@/utils/object";
import { Observable } from "@/utils/observable";
import { useDebounceListener } from "@/hooks/useDebounceListener";
import { CanvasHost } from "./canvasHost";

//temp
const size = {
  width: 800,
  height: 600,
};

export const WorkspaceViewport = memo(() => {
  const rootElementRef = useRef<HTMLDivElement>(null);
  const setWorkspaceViewport = useWorkspacesStore(
    (store) => store.setWorkspaceViewport
  );
  const selectedWorkspaceId = useWorkspacesStore(
    (store) => store.selectedWorkspaceId
  );
  const workspaceViewport = useWorkspacesStore(
    (store) => selectedWorkspaceSelector(store).viewport
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
      { x: 0, y: 0, ...size },
      margin
    );
    setWorkspaceViewport(viewport);
  }, [selectedWorkspaceId]);

  return (
    <div
      ref={rootElementRef}
      className="relative size-full transition-opacity duration-1000"
    >
      {observableViewport.getValue() !== null && (
        <>
          <CanvasHost viewport={observableViewport as Observable<Viewport>} />
          <Ruler
            observableViewport={observableViewport as Observable<Viewport>}
          ></Ruler>
        </>
      )}
    </div>
  );
});
