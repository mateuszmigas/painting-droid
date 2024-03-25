import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { workspaceFormat, workspaceFormatVersion } from "@/contants";
import { saveTextToFile } from "@/utils/fileSystem";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "saveAsWorkspace",
  display: translations.commands.saveAsWorkspace,
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const { canvasData, name, size } = activeWorkspaceSelector(
      context.stores.workspaces()
    );
    const text = JSON.stringify({
      version: workspaceFormatVersion,
      size,
      data: canvasData,
    });
    saveTextToFile(text, name, workspaceFormat);
  },
});
