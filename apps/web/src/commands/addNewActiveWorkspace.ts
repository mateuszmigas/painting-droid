import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "addNewActiveWorkspace",
  name: "Add New Active Workspace",
  icon: "add-file",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores.workspaces().addNewActiveWorkspace();
  },
});
