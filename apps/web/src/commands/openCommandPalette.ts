import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "openCommandPalette",
  display: translations.commands.openCommandPalette,
  icon: "command",
  settings: { showInPalette: false },
  defaultKeyGesture: createSystemKeyGesture({ key: "K", ctrlOrCmd: true }),
  execute: async (context: CommandContext) => {
    context.stores.commandPalette().setIsOpen(true);
  },
});

