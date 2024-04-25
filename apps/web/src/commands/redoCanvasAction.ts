import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isWindowsDesktopOrWeb } from "@/utils/platform";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "redoCanvasAction",
  display: translations.commands.redoCanvasAction,
  icon: "redo",
  defaultKeyGesture: isWindowsDesktopOrWeb()
    ? createKeyGesture({ key: "Z", shift: true, ctrl: true })
    : createKeyGesture({ key: "Z", shift: true, meta: true }),
  settings: { showInPalette: true },
  execute: async (context: CommandContext) =>
    context.canvasActionDispatcher.redo(),
});

