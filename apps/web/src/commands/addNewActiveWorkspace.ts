import { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "addNewActiveWorkspace",
  name: "Add New Active Workspace",
  icon: "plus",
  execute: async (context: CommandContext) => {
    context.stores.workspaces().addNewActiveWorkspace();
  },
});

