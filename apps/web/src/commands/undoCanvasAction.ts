import { getTranslations } from "@/translations";
import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "undoCanvasAction",
  display: translations.commands.undoCanvasAction,
  icon: "undo",
  defaultKeyGesture: createSystemKeyGesture({ key: "Z", ctrlOrCmd: true }),
  config: { showInPalette: true },
  execute: async (context: CommandContext) => context.canvasActionDispatcher.undo(),
});
