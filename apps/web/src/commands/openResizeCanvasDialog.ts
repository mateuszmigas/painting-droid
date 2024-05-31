import { ResizeCanvasDialog } from "@/components/dialogs/resizeCanvasDialog";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "openResizeCanvasDialog",
  display: translations.commands.openResizeCanvasDialog,
  icon: "resize",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    await context.dialogService.openDialog(ResizeCanvasDialog, {});
  },
});

