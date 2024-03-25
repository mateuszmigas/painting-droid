import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { compressedDataToBlob, mergeCompressedData } from "@/utils/imageData";
import { saveBlobToFile } from "@/utils/fileSystem";
import { getTranslations } from "@/translations";

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

    const mergedData = await mergeCompressedData(layersData);
    const blob = await compressedDataToBlob(mergedData, format);
    saveBlobToFile(blob, name, format);
  },
});
