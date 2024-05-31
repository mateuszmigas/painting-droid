import { CropCanvasDialog } from "@/components/dialogs/cropCanvasDialog";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "openCropCanvasDialog",
  display: translations.commands.openCropCanvasDialog,
  icon: "crop",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    await context.dialogService.openDialog(CropCanvasDialog, {});
  },
});

