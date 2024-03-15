import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "undoCanvasAction",
  display: "Undo Canvas Action",
  icon: "undo",
  defaultKeyGesture: createKeyGesture({ key: "Z", meta: true }),
  options: { showInPalette: true },
  execute: async (context: CommandContext) =>
    context.canvasActionDispatcher.undo(),
});
