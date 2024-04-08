import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { fileSystem } from "@/utils/file-system";
import { ImageProcessor } from "@/utils/imageProcessor";

const translations = getTranslations();

export const command = createCommand({
  id: "saveAsJpeg",
  display: translations.commands.saveAsJpeg,
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const format = "jpeg";
    const { canvasData, name } = activeWorkspaceSelector(
      context.stores.workspaces()
    );
    const layersData = canvasData.layers
      .filter((layer) => layer.data)
      .map((layer) => layer.data!);

    const blob = await ImageProcessor.fromMergedCompressed(
      layersData,
      canvasData.size
    ).toBlob(format);
    fileSystem.saveBlobToFile(blob, name, format);
  },
});
