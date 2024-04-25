import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isWindowsDesktopOrWeb } from "@/utils/platform";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "undoCanvasAction",
  display: translations.commands.undoCanvasAction,
  icon: "undo",
  defaultKeyGesture: isWindowsDesktopOrWeb()
    ? createKeyGesture({ key: "Z", ctrl: true })
    : createKeyGesture({ key: "Z", meta: true }),
  settings: { showInPalette: true },
  execute: async (context: CommandContext) =>
    context.canvasActionDispatcher.undo(),
});

