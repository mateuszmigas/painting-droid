import { activeLayerSelector, activeShapeSelector, activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "clearSelection",
  display: translations.commands.clearSelection,
  icon: "eraser",
  defaultKeyGesture: createKeyGesture({ key: "DELETE" }),
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const canvasData = activeWorkspaceCanvasDataSelector(context.stores.workspaces());
    const activeLayer = activeLayerSelector(canvasData);
    const activeShape = activeShapeSelector(canvasData);

    if (activeShape?.capturedArea && activeLayer.data !== null) {
      await context.canvasActionDispatcher.execute("clearCapturedArea", {
        display: translations.commands.clearSelection,
        icon: "eraser",
      });
    }
  },
});
