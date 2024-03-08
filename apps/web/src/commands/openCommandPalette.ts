import { createKeyGesture } from "@/utils/keyGesture";
import { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "openCommandPalette",
  name: "Open Command Palette",
  icon: "command",
  options: { showInPalette: false },
  defaultKeyGesture: createKeyGesture({ key: "J", meta: true }),
  execute: async (context: CommandContext) => {
    context.stores.commandPalette().setIsOpen(true);
  },
});

