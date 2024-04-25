import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isWindowsDesktopOrWeb } from "@/utils/platform";
import { getTranslations } from "@/translations";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { clipboard } from "@/utils/clipboard";

const translations = getTranslations();

export const command = createCommand({
  id: "copyImage",
  display: translations.commands.copyImage,
  icon: "clipboard-copy",
  defaultKeyGesture: isWindowsDesktopOrWeb()
    ? createKeyGesture({ key: "C", ctrl: true })
    : createKeyGesture({ key: "C", meta: true }),
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const canvasData = activeWorkspaceCanvasDataSelector(
      context.stores.workspaces()
    );

    if (canvasData.overlayShape?.captured) {
      try {
        await clipboard.copyImage(canvasData.overlayShape.captured.data);
      } catch {
        context.notificationService.showError(
          translations.errors.copyClipboardError
        );
      }
    }
  },
});

