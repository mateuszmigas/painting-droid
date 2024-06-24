import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  icon: "image-minus_ai",
  id: "openRemoveBackgroundDialog",
  display: translations.models.removeBackground.name,
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    // context.dialogService.openDialog(LabelObjectsDialog, {});
  },
});

