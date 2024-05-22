import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { fileSystem } from "@/utils/file-system";
import { selectLayersAsBlob } from "./selectors/workspace";

const translations = getTranslations();

export const command = createCommand({
  id: "saveAsJpeg",
  display: translations.commands.saveAsJpeg,
  icon: "save",
  settings: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const format = "jpeg";
    const { name, blob } = await selectLayersAsBlob(
      context.stores.workspaces(),
      format
    );
    fileSystem.saveBlobToFile(blob, name, format);
  },
});

