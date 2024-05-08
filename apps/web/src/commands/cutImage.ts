import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { clipboard } from "@/utils/clipboard";

const translations = getTranslations();

export const command = createCommand({
  id: "cutImage",
  display: translations.commands.cutImage,
  icon: "clipboard-cut",
  defaultKeyGesture: createSystemKeyGesture({ key: "X", ctrlOrCmd: true }),
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const canvasData = activeWorkspaceCanvasDataSelector(
      context.stores.workspaces()
    );

    if (canvasData.capturedArea?.captured) {
      await clipboard.copyImage(canvasData.capturedArea.captured.data);

      if (canvasData.layers[canvasData.activeLayerIndex].data !== null) {
        await context.canvasActionDispatcher.execute("cutCapturedArea", {
          display: translations.commands.cutImage,
          icon: "clipboard-cut",
        });
      }
    }
  },
});

