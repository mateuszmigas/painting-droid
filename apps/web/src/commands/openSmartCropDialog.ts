import { SmartCropDialog } from "@/components/dialogs/smartCropDialog";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  icon: "scissors_ai",
  id: "openSmartCropDialog",
  display: translations.models.smartCrop.name,
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.dialogService.openDialog(SmartCropDialog, {});
  },
});
