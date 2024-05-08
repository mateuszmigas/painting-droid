import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { clipboard } from "@/utils/clipboard";

const translations = getTranslations();

export const command = createCommand({
  id: "copyImage",
  display: translations.commands.copyImage,
  icon: "clipboard-copy",
  defaultKeyGesture: createSystemKeyGesture({ key: "C", ctrlOrCmd: true }),
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const canvasData = activeWorkspaceCanvasDataSelector(
      context.stores.workspaces()
    );

    if (canvasData.capturedArea?.captured) {
      try {
        await clipboard.copyImage(canvasData.capturedArea.captured.data);
      } catch {
        context.notificationService.showError(
          translations.errors.copyClipboardError
        );
      }
    }
  },
});

