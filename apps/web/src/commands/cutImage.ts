import { activeLayerSelector, activeShapeSelector, activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { clipboard } from "@/utils/clipboard";
import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "cutImage",
  display: translations.commands.cutImage,
  icon: "clipboard-cut",
  defaultKeyGesture: createSystemKeyGesture({ key: "X", ctrlOrCmd: true }),
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const canvasData = activeWorkspaceCanvasDataSelector(context.stores.workspaces());
    const activeLayer = activeLayerSelector(canvasData);
    const activeShape = activeShapeSelector(canvasData);

    if (activeShape?.capturedArea) {
      await clipboard.copyImage(activeShape.capturedArea.data);

      if (activeLayer.data !== null) {
        await context.canvasActionDispatcher.execute("cutCapturedArea", {
          display: translations.commands.cutImage,
          icon: "clipboard-cut",
        });
      }
    }
  },
});
