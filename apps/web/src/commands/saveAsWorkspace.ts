import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { workspace } from "@/constants";
import { getTranslations } from "@/translations";
import { fileSystem } from "@/utils/file-system";
import { encodePwd } from "@/utils/pdwFormat";

const translations = getTranslations();

export const command = createCommand({
  id: "saveAsWorkspace",
  display: translations.commands.saveAsWorkspace,
  icon: "save",
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const { canvasData, name } = activeWorkspaceSelector(
      context.stores.workspaces()
    );

    const text = await encodePwd(canvasData, workspace.version);
    fileSystem.saveTextToFile(text, name, workspace.format);
  },
});

