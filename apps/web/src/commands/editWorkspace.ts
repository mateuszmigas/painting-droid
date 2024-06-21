import type { WorkspaceId } from "@/store/workspacesStore";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { EditWorkspaceDialog } from "@/components/dialogs/editWorkspaceDialog";

const translations = getTranslations();

export const command = createCommand({
  id: "editWorkspace",
  display: translations.commands.editWorkspace,
  icon: "file-cog",
  config: { showInPalette: true },
  execute: async (
    context: CommandContext,
    payload: { workspaceId?: WorkspaceId }
  ) => {
    const workspaceId =
      payload?.workspaceId ?? context.stores.workspaces().activeWorkspaceId;
    context.dialogService.openDialog(EditWorkspaceDialog, { workspaceId });
  },
});

