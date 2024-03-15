import { useWorkspacesStore } from "@/store";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
// import { useEffect, useMemo } from "react";

export const useCanvasActionDispatcher = () => {
  const workspaceId = useWorkspacesStore(
    (state) => activeWorkspaceSelector(state).id
  );

  //   const actionDispatcher = useMemo(() => {}, [workspaceId]);
  return workspaceId;
  //   useEffect(() => {

  //   }, [workspaceId]);
};

