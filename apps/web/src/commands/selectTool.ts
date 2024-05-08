import type { CanvasToolId } from "@/tools";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { clearOrApplyCapturedArea } from "./utils";

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
    await clearOrApplyCapturedArea(context);
    context.stores.tool().setSelectedToolId(toolId);
  },
});

