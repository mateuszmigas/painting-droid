import type { ToolId } from "@/tools";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";

export const command = createCommand({
  id: "selectTool",
  options: { showInPalette: false },
  execute: async (
    context: CommandContext,
    payload: {
      toolId: ToolId;
    }
  ) => {
    const { toolId } = payload;

    context.stores.tool().setSelectedToolId(toolId);

    const isSelecting =
      activeWorkspaceCanvasDataSelector(context.stores.workspaces())
        .overlayShape !== null;

    isSelecting &&
      context.canvasActionDispatcher.execute("clearOverlayShape", undefined);
  },
});
