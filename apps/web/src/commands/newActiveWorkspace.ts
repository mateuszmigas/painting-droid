import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { CreateWorkspaceDialog } from "@/components/dialogs/createWorkspaceDialog";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "newActiveWorkspace",
  display: translations.commands.newActiveWorkspace,
  icon: "add-file",
  config: { showInPalette: true },
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

