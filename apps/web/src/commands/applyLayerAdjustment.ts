import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import {
  activeLayerSelector,
  activeWorkspaceSelector,
} from "@/store/workspacesStore";

const translations = getTranslations();

type LayerAdjustment = "removeBackground" | "sepia";

export const command = createCommand({
  id: "applyLayerAdjustment",
  display: translations.commands.applyLayerAdjustment,
  icon: "copy",
  config: { showInPalette: true },
  execute: async (
    context: CommandContext,
    payload: { adjustment: LayerAdjustment }
  ) => {
    const { canvasData } = activeWorkspaceSelector(context.stores.workspaces());
    const activeLayer = activeLayerSelector(canvasData);
  },
});
