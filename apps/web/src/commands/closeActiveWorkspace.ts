import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "closeActiveWorkspace",
  display: translations.commands.closeActiveWorkspace,
  icon: "x",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores.workspaces().closeWorkspace(context.stores.workspaces().activeWorkspaceId);
  },
});
