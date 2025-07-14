import { activeShapeSelector, activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { clipboard } from "@/utils/clipboard";
import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "copyImage",
  display: translations.commands.copyImage,
  icon: "clipboard-copy",
  defaultKeyGesture: createSystemKeyGesture({ key: "C", ctrlOrCmd: true }),
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const canvasData = activeWorkspaceCanvasDataSelector(context.stores.workspaces());
    const activeShape = activeShapeSelector(canvasData);

    if (activeShape?.capturedArea) {
      try {
        await clipboard.copyImage(activeShape.capturedArea.data);
      } catch {
        context.notificationService.showError(translations.errors.copyClipboardError);
      }
    }
  },
});
