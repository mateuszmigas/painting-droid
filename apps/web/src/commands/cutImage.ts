import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import {
  activeLayerSelector,
  activeShapeSelector,
  activeWorkspaceCanvasDataSelector,
} from "@/store/workspacesStore";
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

