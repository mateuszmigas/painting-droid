import { workspace } from "@/constants";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { fileSystem } from "@/utils/file-system";
import { encodePwd } from "@/utils/pdwFormat";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "saveAsWorkspace",
  display: translations.commands.saveAsWorkspace,
  icon: "save",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const { canvasData, name } = activeWorkspaceSelector(context.stores.workspaces());

    const text = await encodePwd(canvasData, workspace.version);
    fileSystem.saveTextToFile(text, name, workspace.format);
  },
});
