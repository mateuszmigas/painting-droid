import type { ToolId } from "@/tools";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

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

    context.stores.tool().setSelectedToolId(toolId);
    context.canvasActionDispatcher.execute("drawOverlayShape", {
      overlayShape: null,
    });
  },
});
