import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "clearActiveWorkspace",
  display: "Clear Workspace",
  icon: "x",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores
      .workspaces()
      .clearWorkspace(context.stores.workspaces().activeWorkspaceId);
    context.canvasActionDispatcher.clear();
  },
});
