import { LabelObjectsDialog } from "@/components/dialogs/labelObjectsDialog";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  icon: "tags_ai",
  id: "openLabelObjectsDialog",
  display: translations.models.labelObjects.name,
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.dialogService.openDialog(LabelObjectsDialog, {});
  },
});
