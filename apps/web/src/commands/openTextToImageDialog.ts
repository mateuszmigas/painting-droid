import { TextToImageDialog } from "@/components/dialogs/textToImageDialog";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  icon: "image-add_ai",
  id: "openTextToImageDialog",
  display: translations.models.textToImage.name,
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.dialogService.openDialog(TextToImageDialog, {});
  },
});
