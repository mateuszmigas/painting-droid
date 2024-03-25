import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { CreateWorkspaceDialog } from "@/components/dialogs/createWorkspaceDialog";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "createActiveWorkspace",
  display: translations.commands.createActiveWorkspace,
  icon: "add-file",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const result = await context.dialogService.openDialog(
      CreateWorkspaceDialog,
      {}
    );
    if (result) {
      context.stores.workspaces().addNewActiveWorkspace(result);
    }
  },
});
