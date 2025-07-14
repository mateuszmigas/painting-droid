import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "openChatPopup",
  display: translations.commands.openChatPopup,
  icon: "bot_ai",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores.workspaces().openPopup({ type: "chat" });
  },
});
