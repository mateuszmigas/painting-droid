import type { CanvasToolId } from "@/tools";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { clearOrApplyOverlayShape } from "./utils";

export const command = createCommand({
  id: "selectTool",
  settings: { showInPalette: false },
  execute: async (
    context: CommandContext,
    payload: {
      toolId: CanvasToolId;
    }
  ) => {
    const { toolId } = payload;
    await clearOrApplyOverlayShape(context);
    context.stores.tool().setSelectedToolId(toolId);
  },
});

