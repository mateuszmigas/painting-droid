import { CanvasActionDispatcher } from "@/canvas/canvasActionDispatcher";
import { useWorkspacesStore } from "@/store";
import {
  type WorkspaceId,
  activeWorkspaceSelector,
} from "@/store/workspacesStore";
import { useMemo } from "react";

const dispatchersCache: Record<WorkspaceId, CanvasActionDispatcher> = {};

const clearZombieDispatchers = (workspaceIds: WorkspaceId[]) => {
  const dispatchersWorkspaceIds = Object.keys(dispatchersCache);

  for (const id of dispatchersWorkspaceIds) {
    if (!workspaceIds.includes(id)) {
      delete dispatchersCache[id];
    }
  }
};

export const useCanvasActionDispatcher = () => {
  const workspaceId = useWorkspacesStore(
    (state) => activeWorkspaceSelector(state).id
  );
  const workspacesLength = useWorkspacesStore(
    (state) => state.workspaces.length
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Using workspaces.length to trigger the memoization
  const canvasActionDispatcher = useMemo(() => {
    const workspaceIds = useWorkspacesStore
      .getState()
      .workspaces.map((w) => w.id);
    clearZombieDispatchers(workspaceIds);

    if (!dispatchersCache[workspaceId]) {
      const dispatcher = new CanvasActionDispatcher();
      dispatcher.init({
        getState: () =>
          activeWorkspaceSelector(useWorkspacesStore.getState()).canvasData,
        setState: (state) => {
          return useWorkspacesStore.getState().setCanvasData(state);
        },
      });
      dispatchersCache[workspaceId] = dispatcher;
    }

    return dispatchersCache[workspaceId];
  }, [workspacesLength, workspaceId]);

  return canvasActionDispatcher;
};
