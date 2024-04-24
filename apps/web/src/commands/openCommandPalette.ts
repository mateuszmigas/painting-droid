import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { isWindows } from "@/utils/platform";

const translations = getTranslations();

export const command = createCommand({
  id: "openCommandPalette",
  display: translations.commands.openCommandPalette,
  icon: "command",
  settings: { showInPalette: false },
  defaultKeyGesture: isWindows()
    ? createKeyGesture({ key: "K", ctrl: true })
    : createKeyGesture({ key: "K", meta: true }),
  execute: async (context: CommandContext) => {
    context.stores.commandPalette().setIsOpen(true);
  },
});
