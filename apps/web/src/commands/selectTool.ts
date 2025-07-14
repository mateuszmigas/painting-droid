import { activeShapeSelector, activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import type { CanvasToolId } from "@/tools";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "selectTool",
  config: { showInPalette: false },
  execute: async (
    context: CommandContext,
    payload: {
      toolId: CanvasToolId;
    },
  ) => {
    const { toolId } = payload;

    const canvasData = activeWorkspaceCanvasDataSelector(context.stores.workspaces());

    if (activeShapeSelector(canvasData)) {
      await context.canvasActionDispatcher.execute("resolveActiveShape", undefined);
    }

    context.stores.tool().setSelectedToolId(toolId);
  },
});
