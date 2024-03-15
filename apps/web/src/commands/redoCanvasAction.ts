import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "redoCanvasAction",
  display: "Redo Canvas Action",
  icon: "redo",
  defaultKeyGesture: createKeyGesture({ key: "Z", shift: true, meta: true }),
  options: { showInPalette: true },
  execute: async (context: CommandContext) =>
    context.canvasActionDispatcher.redo(),
});
