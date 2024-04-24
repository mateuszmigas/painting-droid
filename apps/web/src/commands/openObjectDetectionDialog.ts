import { ObjectDetectionDialog } from "@/components/dialogs/objectDetectionDialog";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  icon: "shapes",
  id: "openObjectDetectionDialog",
  display: translations.models.objectDetection.name,
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.dialogService.openDialog(ObjectDetectionDialog, {});
  },
});
