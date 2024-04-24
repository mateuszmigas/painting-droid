import {
  getDefaultAdjustmentsSettings,
  type AdjustmentId,
} from "@/adjustments";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  icon: "x",
  id: "openAdjustmentsPopup",
  settings: { showInPalette: false },
  execute: async (
    context: CommandContext,
    payload: { adjustmentId: AdjustmentId }
  ) => {
    context.stores.workspaces().openApplyPopup({
      type: "adjustments",
      adjustmentId: payload.adjustmentId,
      settings: getDefaultAdjustmentsSettings(payload.adjustmentId),
    });
  },
});
