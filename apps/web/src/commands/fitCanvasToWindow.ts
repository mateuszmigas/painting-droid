import { calculateFitViewport } from "@/utils/manipulation";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "fitCanvasToWindow",
  display: translations.commands.fitCanvasToWindow,
  icon: "fullscreen",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const { size } = activeWorkspaceSelector(context.stores.workspaces());

    const { width, height } = document
      .getElementById("workspace-viewport")!
      .getBoundingClientRect();

    const margin = Math.min(width, height) * 0.1;
    const viewport = calculateFitViewport(
      { width, height },
      { x: 0, y: 0, ...size },
      margin
    );

    context.stores.workspaces().setWorkspaceViewport(viewport);
  },
});
