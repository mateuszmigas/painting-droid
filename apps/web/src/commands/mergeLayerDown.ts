import { activeWorkspaceActiveLayerSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "mergeLayerDown",
  display: translations.commands.mergeLayerDown,
  icon: "merge",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const activeLayerId = activeWorkspaceActiveLayerSelector(context.stores.workspaces()).id;

    context.canvasActionDispatcher.execute("mergeLayerDown", {
      layerId: activeLayerId,
    });
  },
});
