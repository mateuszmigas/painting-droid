import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isWindows } from "@/utils/platform";

export const command = createCommand({
  id: "redoCanvasAction",
  display: "Redo Canvas Action",
  icon: "redo",
  defaultKeyGesture: isWindows()
    ? createKeyGesture({ key: "Z", shift: true, ctrl: true })
    : createKeyGesture({ key: "Z", shift: true, meta: true }),
  options: { showInPalette: true },
  execute: async (context: CommandContext) =>
    context.canvasActionDispatcher.redo(),
});
