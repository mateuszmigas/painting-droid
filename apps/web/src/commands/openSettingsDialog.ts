import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { SettingsDialog } from "@/components/dialogs/settingsDialog";

const translations = getTranslations();

export const command = createCommand({
  id: "openSettingsDialog",
  display: translations.commands.openSettingsDialog,
  icon: "settings",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    await context.dialogService.openDialog(SettingsDialog, {});
  },
});

