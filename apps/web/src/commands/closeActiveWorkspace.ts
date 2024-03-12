import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "closeActiveWorkspace",
  name: "Close Active Workspace",
  icon: "x",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores
      .workspaces()
      .closeWorkspace(context.stores.workspaces().selectedWorkspaceId);
  },
});

