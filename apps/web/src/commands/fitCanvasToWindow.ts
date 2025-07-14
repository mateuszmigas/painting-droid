import { domNames } from "@/constants";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { calculateFitViewport } from "@/utils/manipulation";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "fitCanvasToWindow",
  display: translations.commands.fitCanvasToWindow,
  icon: "fullscreen",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const { size } = activeWorkspaceCanvasDataSelector(context.stores.workspaces());

    const { width, height } = document.getElementById(domNames.workspaceViewport)!.getBoundingClientRect();

    const margin = Math.min(width, height) * 0.1;
    const viewport = calculateFitViewport({ width, height }, { x: 0, y: 0, ...size }, margin);

    context.stores.workspaces().setWorkspaceViewport(viewport);
  },
});
