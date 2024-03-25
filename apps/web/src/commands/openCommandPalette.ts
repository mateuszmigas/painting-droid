import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "openCommandPalette",
  display: translations.commands.openCommandPalette,
  icon: "command",
  options: { showInPalette: false },
  defaultKeyGesture: createKeyGesture({ key: "K", meta: true }),
  execute: async (context: CommandContext) => {
    context.stores.commandPalette().setIsOpen(true);
  },
});
