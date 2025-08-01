import { getTranslations } from "@/translations";
import { fileSystem } from "@/utils/file-system";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { selectWorkspaceAsImage } from "./selectors/workspace";

const translations = getTranslations();

export const command = createCommand({
  id: "saveAsPng",
  display: translations.commands.saveAsPng,
  icon: "save",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const format = "png";
    const { name, blob } = await selectWorkspaceAsImage(context.stores.workspaces(), format);
    fileSystem.saveBlobToFile(blob, name, format);
  },
});
