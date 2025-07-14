import { ImageToImageDialog } from "@/components/dialogs/imageToImageDialog";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  icon: "image-copy_ai",
  id: "openImageToImageDialog",
  display: translations.models.imageToImage.name,
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.dialogService.openDialog(ImageToImageDialog, {});
  },
});
