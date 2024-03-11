import { workspaceCanvasHistory } from "@/history";
import type { WorkspaceId } from "@/store/workspacesStore";
import type { CanvasContext } from "@/utils/common";
import {
  createCompressedFromContext,
  restoreContextFromCompressed,
} from "@/utils/imageData";
import { useMemo, useRef } from "react";

export type CanvasContextLock = {
  applyChanges: () => void;
  rejectChanges: () => void;
  getContext: () => CanvasContext;
};

export type CanvasContextDispatcher = {
  requestContextLock: () => CanvasContextLock;
  restoreContext: (
    workspaceId: WorkspaceId,
    context: CanvasContext
  ) => Promise<void>;
};

export const useCanvasContextDispatcher = (
  workspaceId: WorkspaceId,
  context: CanvasContext
) => {
  const lockedRef = useRef(false);
  const dispatcher = useMemo<CanvasContextDispatcher>(() => {
    return {
      requestContextLock: (): CanvasContextLock => {
        // if (lockedRef.current) {
        //   throw new Error("Context is already locked");
        // }
        lockedRef.current = true;
        const imageData = createCompressedFromContext(context);
        console.log("locking context", workspaceId);
        workspaceCanvasHistory.push(workspaceId, imageData);
        return {
          applyChanges: async () => {
            workspaceCanvasHistory.push(
              workspaceId,
              createCompressedFromContext(context)
            );
            lockedRef.current = false;
          },
          rejectChanges: async () => {
            const imageData = workspaceCanvasHistory.getLatest(workspaceId);
            if (imageData) {
              restoreContextFromCompressed(imageData, context);
            }
            lockedRef.current = false;
          },
          getContext: () => context,
        };
      },
      restoreContext: async (
        workspaceId: WorkspaceId,
        context: CanvasContext
      ) => {
        console.log("restoring context", workspaceId);
        const imageData = workspaceCanvasHistory.getLatest(workspaceId);
        if (imageData) {
          await restoreContextFromCompressed(imageData, context);
        }
      },
    };
  }, [workspaceId, context]);

  return dispatcher;
};

