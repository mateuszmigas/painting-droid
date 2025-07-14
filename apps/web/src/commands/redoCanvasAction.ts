import { getTranslations } from "@/translations";
import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "redoCanvasAction",
  display: translations.commands.redoCanvasAction,
  icon: "redo",
  defaultKeyGesture: createSystemKeyGesture({
    key: "Z",
    shift: true,
    ctrlOrCmd: true,
  }),
  config: { showInPalette: true },
  execute: async (context: CommandContext) => context.canvasActionDispatcher.redo(),
});
