import { dialogManager } from "@/components/dialogHost";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { CreateWorkspaceDialog } from "@/components/dialogs/createWorkspaceDialog";

export const command = createCommand({
  id: "createActiveWorkspace",
  display: "Create New Workspace",
  icon: "add-file",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const result = await dialogManager.open(CreateWorkspaceDialog, {});
    if (result) {
      context.stores.workspaces().addNewActiveWorkspace(result);
    }
  },
});

