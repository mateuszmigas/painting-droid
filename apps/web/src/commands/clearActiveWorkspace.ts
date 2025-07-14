import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "clearActiveWorkspace",
  display: translations.commands.clearActiveWorkspace,
  icon: "x",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores.workspaces().clearWorkspace(context.stores.workspaces().activeWorkspaceId);
    context.canvasActionDispatcher.clear();
  },
});
