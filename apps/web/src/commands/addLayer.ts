import { getTranslations } from "@/translations";
import { uuid } from "@/utils/uuid";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "addLayer",
  display: translations.commands.addLayer,
  icon: "plus",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.canvasActionDispatcher.execute("addLayer", { id: uuid() });
  },
});
