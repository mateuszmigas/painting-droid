import type { ToolId } from "@/tools";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { clearOrApplyOverlayShape } from "./utils";

export const command = createCommand({
  id: "selectTool",
  options: { showInPalette: false },
  execute: async (
    context: CommandContext,
    payload: {
      toolId: ToolId;
    }
  ) => {
    const { toolId } = payload;
    await clearOrApplyOverlayShape(context);
    context.stores.tool().setSelectedToolId(toolId);
  },
});
