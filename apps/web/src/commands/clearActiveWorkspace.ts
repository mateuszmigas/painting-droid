import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "clearActiveWorkspace",
  display: translations.commands.clearActiveWorkspace,
  icon: "x",
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores
      .workspaces()
      .clearWorkspace(context.stores.workspaces().activeWorkspaceId);
    context.canvasActionDispatcher.clear();
  },
});
