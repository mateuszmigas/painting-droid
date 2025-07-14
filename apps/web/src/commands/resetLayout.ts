import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "resetLayout",
  display: translations.commands.resetLayout,
  icon: "reset",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores.layout().resetLayout();
  },
});
