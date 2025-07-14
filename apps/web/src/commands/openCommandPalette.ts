import { getTranslations } from "@/translations";
import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "openCommandPalette",
  display: translations.commands.openCommandPalette,
  icon: "command",
  config: { showInPalette: false },
  defaultKeyGesture: createSystemKeyGesture({ key: "K", ctrlOrCmd: true }),
  execute: async (context: CommandContext) => {
    context.stores.commandPalette().setIsOpen(true);
  },
});
