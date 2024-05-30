import { activeWorkspaceActiveLayerSelector } from "@/store/workspacesStore";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "moveLayerDown",
  display: translations.commands.moveLayerDown,
  icon: "arrow-down",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const activeLayerId = activeWorkspaceActiveLayerSelector(
      context.stores.workspaces()
    ).id;

    context.canvasActionDispatcher.execute("moveLayerDown", {
      layerId: activeLayerId,
    });
  },
});

