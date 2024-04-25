import { createSystemKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";

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
  settings: { showInPalette: true },
  execute: async (context: CommandContext) =>
    context.canvasActionDispatcher.redo(),
});

