import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { SmartCropDialog } from "@/components/dialogs/smartCropDialog";

const translations = getTranslations();

export const command = createCommand({
  icon: "shapes",
  id: "openSmartCropDialog",
  display: translations.models.smartCrop.name,
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.dialogService.openDialog(SmartCropDialog, {});
  },
});

