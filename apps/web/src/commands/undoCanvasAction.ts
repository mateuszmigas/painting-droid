import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isWindows } from "@/utils/platform";

export const command = createCommand({
  id: "undoCanvasAction",
  display: "Undo Canvas Action",
  icon: "undo",
  defaultKeyGesture: isWindows()
    ? createKeyGesture({ key: "Z", ctrl: true })
    : createKeyGesture({ key: "Z", meta: true }),
  options: { showInPalette: true },
  execute: async (context: CommandContext) =>
    context.canvasActionDispatcher.undo(),
});
