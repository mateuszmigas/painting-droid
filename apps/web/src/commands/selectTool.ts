import type { CanvasToolId } from "@/tools";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import {
  activeShapeSelector,
  activeWorkspaceCanvasDataSelector,
} from "@/store/workspacesStore";

export const command = createCommand({
  id: "selectTool",
  settings: { showInPalette: false },
  execute: async (
    context: CommandContext,
    payload: {
      toolId: CanvasToolId;
    }
  ) => {
    const { toolId } = payload;

    const canvasData = activeWorkspaceCanvasDataSelector(
      context.stores.workspaces()
    );

    if (activeShapeSelector(canvasData)) {
      await context.canvasActionDispatcher.execute(
        "resolveActiveShape",
        undefined
      );
    }

    context.stores.tool().setSelectedToolId(toolId);
  },
});

