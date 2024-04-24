import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "resetLayout",
  display: translations.commands.resetLayout,
  icon: "reset",
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores.layout().resetLayout();
  },
});
