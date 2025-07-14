import { activeWorkspaceActiveLayerSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "moveLayerUp",
  display: translations.commands.moveLayerUp,
  icon: "arrow-up",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const activeLayerId = activeWorkspaceActiveLayerSelector(context.stores.workspaces()).id;

    context.canvasActionDispatcher.execute("moveLayerUp", {
      layerId: activeLayerId,
    });
  },
});
