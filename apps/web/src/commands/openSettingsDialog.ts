import { SettingsDialog } from "@/components/dialogs/settings-dialog/settingsDialog";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "openSettingsDialog",
  display: translations.commands.openSettingsDialog,
  icon: "settings",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    await context.dialogService.openDialog(SettingsDialog, {});
  },
});
