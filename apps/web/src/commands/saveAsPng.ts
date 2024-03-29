import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { compressedDataToBlob, mergeCompressedData } from "@/utils/imageData";
import { getTranslations } from "@/translations";
import { fileSystem } from "@/utils/file-system";

const translations = getTranslations();

export const command = createCommand({
  id: "saveAsPng",
  display: translations.commands.saveAsPng,
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const format = "png";
    const { canvasData, name } = activeWorkspaceSelector(
      context.stores.workspaces()
    );
    const layersData = canvasData.layers
      .filter((layer) => layer.data)
      .map((layer) => layer.data!);

    const mergedData = await mergeCompressedData(layersData);
    const blob = await compressedDataToBlob(mergedData, format);
    fileSystem.saveBlobToFile(blob, name, format);
  },
});
