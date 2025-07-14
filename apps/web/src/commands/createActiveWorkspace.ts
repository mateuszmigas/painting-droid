import { CreateWorkspaceDialog } from "@/components/dialogs/createWorkspaceDialog";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "createActiveWorkspace",
  display: translations.commands.createActiveWorkspace,
  icon: "add-file",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const result = await context.dialogService.openDialog(CreateWorkspaceDialog, {});
    if (result) {
      context.stores.workspaces().addNewActiveWorkspace(result.size, result.name.trim(), result.color);
    }
  },
});
