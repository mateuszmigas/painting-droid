import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { SmartCropDialog } from "@/components/dialogs/smartCropDialog";

const translations = getTranslations();

export const command = createCommand({
  icon: "scissors",
  id: "openSmartCropDialog",
  display: translations.models.smartCrop.name,
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.dialogService.openDialog(SmartCropDialog, {});
  },
});

