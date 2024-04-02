import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isWindows } from "@/utils/platform";
import { getTranslations } from "@/translations";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { clipboard } from "@/utils/clipboard";

const translations = getTranslations();

export const command = createCommand({
  id: "cutImage",
  display: translations.commands.cutImage,
  icon: "clipboard-cut",
  defaultKeyGesture: isWindows()
    ? createKeyGesture({ key: "X", ctrl: true })
    : createKeyGesture({ key: "X", meta: true }),
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const canvasData = activeWorkspaceCanvasDataSelector(
      context.stores.workspaces()
    );

    if (canvasData.overlayShape?.captured) {
      await clipboard.copyImage(canvasData.overlayShape.captured.data);
      await context.canvasActionDispatcher.execute("cutOverlayShape", {
        display: translations.commands.cutImage,
        icon: "clipboard-cut",
      });
    }
  },
});
