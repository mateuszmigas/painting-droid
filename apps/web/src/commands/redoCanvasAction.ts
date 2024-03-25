import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isWindows } from "@/utils/platform";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "redoCanvasAction",
  display: translations.commands.redoCanvasAction,
  icon: "redo",
  defaultKeyGesture: isWindows()
    ? createKeyGesture({ key: "Z", shift: true, ctrl: true })
    : createKeyGesture({ key: "Z", shift: true, meta: true }),
  options: { showInPalette: true },
  execute: async (context: CommandContext) =>
    context.canvasActionDispatcher.redo(),
});
