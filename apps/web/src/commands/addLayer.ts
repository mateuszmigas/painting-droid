import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "addLayer",
  display: translations.commands.addLayer,
  icon: "plus",
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.canvasActionDispatcher.execute("addLayer", {});
  },
});
